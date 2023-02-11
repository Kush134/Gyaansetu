import textstat
import redis
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import re
from collections import OrderedDict
import json
from docSimilarity import documentSimilarity
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential
import time
import wikipedia

# REARRANGE URLs ACC TO PRIORITY LEVEL


def sort_urls_by_priority(urls, priority_keywords, ignore_keywords):
    # Assign a priority level based on the index of the first priority keyword in the URL
    priority_levels = [len(priority_keywords) + 1 for url in urls]
    # list of tuples where each tuple consists of the URL and its priority level
    url_priority_pairs = []
    for i, url in enumerate(urls):
        if not any(keyword in url for keyword in ignore_keywords):
            # only add the URL to the list if it does not contain any of the ignore keywords
            for j, keyword in enumerate(priority_keywords):
                if keyword in url:
                    priority_levels[i] = j
                    break
            url_priority_pairs.append((url, priority_levels[i]))

    # Sort the list of tuples by the priority level (second element in the tuple) in ascending order
    sorted_url_priority_pairs = sorted(url_priority_pairs, key=lambda x: x[1])

    # Extract the URLs from the sorted list of tuples and return them as a new list
    return [pair[0] for pair in sorted_url_priority_pairs]


# Add your Bing Search V7 subscription key and endpoint to your environment variables.
subscription_key = "b42a0d68f0c949f582f44edddd782914"
endpoint = "https://api.bing.microsoft.com/v7.0/search/"


def query_to_url(query):  # Query term(s) to search for.
    # Construct a request
    mkt = 'en-US'
    params = {'q': query, 'mkt': mkt}
    headers = {'Ocp-Apim-Subscription-Key': subscription_key}

    # Call the API
    try:
        response = requests.get(endpoint, headers=headers, params=params)
        response.raise_for_status()

        data = response.json()

        data2 = data["webPages"]["value"]

        length = len(data2)

        urls = []

        for i in range(length):
            url = data2[i]["url"]
            #name = data2[i]["name"]
            if url.endswith(".pdf"):
                continue
            #print(name + ": " + url)
            urls.append(url)

        # print(urls)
        ignore_keywords = ['dictionary', 'youtube', 'python', 'pypi']
        priority_keywords = ['wikipedia', 'geeksforgeeks',
                             'tutorialspoint', 'w3schools']
        # Sort the URLs according to the specified priority levels
        urls = sort_urls_by_priority(urls, priority_keywords, ignore_keywords)

        return(urls)
    except Exception as ex:
        raise ex


# EXTRACT DATA (HEADINGS AND PARAGRAPHS) FROM URLS TO DICTIONARY FORMAT
DELIMITER = '\n'


def extract_source(url):
    agent = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0"}
    source = requests.get(url, headers=agent).text
    return source


def extract_data(source, unwanted, url):
    soup = BeautifulSoup(source, 'lxml')
    headings = soup.find_all(re.compile("^h[1-6]$"))

    headings_dict = OrderedDict()
    hierarchy = [headings_dict]
    current_dict = headings_dict

    # Convert all elements in the unwanted list to lowercase
    unwanted = [x.lower() for x in unwanted]

    for heading in headings:
        level = int(heading.name[1])

        # Move up the hierarchy if needed
        while level < len(hierarchy):
            hierarchy.pop()
            current_dict = hierarchy[-1]

        # Check if the heading text is in the list of unwanted headings
        if heading.text.strip().replace("[edit]", "").lower() not in unwanted:
            # Add the heading to the current position in the hierarchy
            current_dict[heading.text.strip().replace(
                "[edit]", "")] = OrderedDict()
            current_dict = current_dict[heading.text.strip().replace(
                "[edit]", "")]

            # Move down the hierarchy
            hierarchy.append(current_dict)

            # Add the URL to the current position in the hierarchy
            current_dict["url"] = url

            # Initialize an empty list to store the paragraphs
            paragraphs = []

            # Set the starting element to the heading element
            current_element = heading

            # Loop until we reach a different heading element or the end of the document
            while True:
                # Get the next element
                next_element = current_element.next_sibling

                # If the next element is a paragraph, add it to the list
                if next_element and (next_element.name == 'p' or next_element.name == 'li' or next_element.name == 'ul' or next_element.name == 'pre'):
                    paragraphs.append(next_element.text.strip().replace(
                        "\n", "").replace("\r", "").replace("\t", ""))

                # If the next element is a heading, break the loop
                elif next_element and next_element.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                    break

                # If the next element is None, break the loop
                elif next_element is None:
                    break

                # Set the current element to the next element
                current_element = next_element

            if paragraphs:
                current_dict["paragraphs"] = paragraphs

    headings_dict = json.dumps(headings_dict, indent=4)
    return headings_dict


def urls_to_dict(urls, query):
    dictionaries = []
    word = query
    wikipedia.set_lang("en")

    try:
        page = wikipedia.page(word)
        summary = page.summary
        my_dict = {"Definition": {
            "paragraphs": [summary]
        }
        }
        # print(my_dict)
        dictionaries.append(my_dict)
    except wikipedia.exceptions.PageError:
        print("Page not found")

    unwanted = ["Contents", "See also", "References", "Further reading", "External links", "navigation menu", "personal tools", "namespaces", "views", "navigation", "contribute", "tools", "print/export", "In other projects", "Languages", "Additional menu", "Related Posts:", "Reader Interactions", "Leave a Reply Cancel reply", "For Members",
                "Member Benefits", "Continue Reading", "Quick Links", "Upcoming Events", "Share", "Using PyPI", "Contributing to PyPI", "About PyPI", "Help", "Source Distribution", "Download files", "Release history\n\nRelease notifications |\n              RSS feed", "Classifiers", "Maintainers", "Meta", "Project links", "Project details", "Project description", "Instagram"]
    for url in urls:
        try:
            d = extract_data(extract_source(url), unwanted, url)
            dictionaries.append(json.loads(d.strip().replace("\n", "")))

        except:
            # An error occurred while trying to connect to the website.
            # Skip to the next iteration of the loop.
            # TODO: edit to return error also
            print(
                f'Sorry, an error occurred while trying to connect to the website: {url}.')
            continue

    # print(dictionaries)
    return dictionaries


# TO FIND SIMILAR STRINGS
def find_similar_strings(dict1, dict2, processed_strings=set()):
    found_similar = False
    dict2_copy = dict2.copy()
    for key2 in dict2_copy:
        if key2 and key2 != 'paragraphs':
            best_match = None
            best_similarity = 1.0
            for key1 in dict1:
                if key1 and key1 != 'paragraphs' and key1 != 'url' and key1 not in processed_strings:
                    similarity = documentSimilarity(key1, key2)
                    if similarity < 0.7 and similarity < best_similarity:
                        best_match = key1
                        best_similarity = similarity
            if best_match is not None:
                dict1[best_match].update(dict2[key2])
                del dict2[key2]
                #print(f'strings {best_match} and {key2} are similar')
                found_similar = True
                processed_strings.add(best_match)
                processed_strings.add(key2)
            elif isinstance(dict2[key2], dict):
                found_similar = find_similar_strings(
                    dict1, dict2[key2], processed_strings)
                if found_similar:
                    break
    for key1 in dict1:
        if not found_similar and isinstance(dict1[key1], dict):
            found_similar = find_similar_strings(
                dict1[key1], dict2, processed_strings)
            if found_similar:
                break

    return found_similar


def calculate_reading_time(d):
    total_reading_time = 0
    for key, value in d.copy().items():
        if key == "paragraphs":
            # Concatenate the list of strings into a single string
            text = ' '.join(value)
            # Calculate reading time for the list of strings
            reading_time = textstat.reading_time(text)
            # Add the reading time to a node with the key 'reading_time'
            #d["reading_time"] = reading_time
            total_reading_time += reading_time
        elif type(value) is dict:
            # Recursively call the function for nested dictionaries
            total_reading_time += calculate_reading_time(value)
    # Add the total reading time for all child nodes to a node with the key 'total_reading_time'
    d["atotal_reading_time"] = total_reading_time
    return total_reading_time


# AZURE SUMMARIZER
key_sum = "503b7fce68494801a92459745a1dcd06"
endpoint_sum = "https://crawler-cognitive.cognitiveservices.azure.com/"


# Authenticate the client using your key and endpoint
def authenticate_client():
    ta_credential = AzureKeyCredential(key_sum)
    text_analytics_client = TextAnalyticsClient(
        endpoint=endpoint_sum,
        credential=ta_credential)
    return text_analytics_client


client = authenticate_client()

# Example method for summarizing text


def sample_extractive_summarization(client, document):
    from azure.core.credentials import AzureKeyCredential
    from azure.ai.textanalytics import (
        TextAnalyticsClient,
        ExtractSummaryAction
    )
    poller = client.begin_analyze_actions(
        document,
        actions=[
            ExtractSummaryAction()
        ],
    )
    document_results = poller.result()
    for result in document_results:
        extract_summary_result = result[0]  # first document, first result
        if extract_summary_result.is_error:
            print("...Is an error with code '{}' and message '{}'".format(
                extract_summary_result.code, extract_summary_result.message
            ))
        else:
            """ print("\n{}".format(
                " ".join([sentence.text for sentence in extract_summary_result.sentences]))
            ) """
            answer = "".join(
                [sentence.text for sentence in extract_summary_result.sentences])
            return answer.strip()

# FUNCTION FOR EXTRACTING PARAGRAPHS FROM DICTIONARY


def extract_and_summarize(nested_dict, client):
    def traverse(d):
        for key, value in d.items():
            if key == 'paragraphs' and value is not None:
                result = ''.join(value)
                par = []
                par.append(result)

                def remove_newlines(strings):
                    stripped = [string.strip() for string in strings]
                    return stripped
                par2 = remove_newlines(par)
                # Check for empty or whitespace-only strings
                if par2 and par2[0].strip():
                    summarized_value = sample_extractive_summarization(
                        client, par2)
                else:
                    summarized_value = ''
                d[key] = summarized_value
            elif isinstance(value, dict):
                traverse(value)
    traverse(nested_dict)
    return nested_dict


# API START HERE
app = Flask(__name__)
CORS(app)
cache = redis.Redis(host='redis', port=6379)

dict_to_summarize = {}


@app.route('/api/function', methods=['POST'])
def function():
    global dict_to_summarize  # Declare the variable as global inside the function
    data = request.get_json()
    function_name = data.get('function')  # type: ignore
    result = {}
    if function_name == 'query_input':
        query = data.get('value')  # type: ignore
        urls = query_to_url(query)
        dictionaries = urls_to_dict(urls, query)
        result = dictionaries[0]
        for i in range(1, len(dictionaries)):
            find_similar_strings(result, dictionaries[i])
            result.update(dictionaries[i])
        calculate_reading_time(result)
        # Convert the result dictionary to an OrderedDict
        result = dict(result)
    else:
        result = "Invalid function name"

    dict_to_summarize = result
    return json.dumps(result)


@app.route('/api/extract_and_summarize', methods=['GET'])
def extract_and_summarize_endpoint():
    global dict_to_summarize  # Declare the variable as global inside the function
    # Call the extract_and_summarize function
    output = extract_and_summarize(dict_to_summarize, client)
    output = dict(output)
    # Return the result of the function to the client
    return json.dumps(output)


if __name__ == '__main__':
    app.run(debug=True)
