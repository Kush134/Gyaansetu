# Gyaan Setu

Gyaan Setu is a platform that helps students, teachers, researchers, and developers easily take and organize notes on any topic of interest. It uses an algorithm to curate the most relevant, concise, and organized content for the user, allowing them to quickly review and delete any unnecessary information. Gyaan Setu offers an efficient and intuitive way to learn, saving users time and helping them focus on what really matters – advancing their knowledge.
The problem statement it solves lies in the 'education' sector.

**Key Features of Gyaan Setu**
1. Allow users to take notes by **deleting** them!
2. The very basic innovation which differentiates Gyaan Setu from other available platforms is that it does not rely on personal content creators for providing the results of user’s search queries.
3. Instead, the algorithm works in such a way that it scrapes the internet for the diverse media on the topics already available on different platforms to extract only the relevant material from them while citing them in the output to users in case the users need more insight.
4. It is specifically designed for the needs of students, teachers, researchers, and developers and it is not a general search engine that returns a wide variety of results for any given query.
5. While the other platforms can assist with finding relevant information and providing summaries, Gyaan Setu is focused on curating the information to make it easier for users to take notes.

**Link to Solution:** https://delightful-sea-0f50b2e10.2.azurestaticapps.net/

## Tech Stack
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine, used for building server-side applications.
 - **Flask**: A microweb framework written in Python, used for building web applications.
 - **Docker**: An open-source containerization platform that allows developers to package and deploy applications in lightweight containers.
 - **Azure Cognitive Services**: A set of APIs, SDKs, and services that allow developers to add intelligent features, such as vision and speech recognition, to their applications.
 - **Bing Web Search API**: An API provided by Azure Cognitive Services that allows developers to search the web and retrieve relevant results from the Bing search engine.
 
 
## Installation
To install and set up this project on your local machine, follow these steps:
### Download project locally
1. Clone the repository:
```
git clone 
```
2. Change into the project directory:
```
cd Gyan-Setu
```
### Set up Node.js
1. Initialize:
```
npm init
```
2. Install dependencies:
```
npm i express.js nodemon
```
3. Start the server:
```
npm start
```
This should install and set up the project on your local machine. If you encounter any issues or have any questions, don't hesitate to reach out for help.

4. Open `http://localhost:8080/` in the browser to view the website.

### Set up the Rest API

> **Note**: This project requires `Python 3.10`. Make sure that this is satisfied before proceeding, otherwise error may be encountered.

1. Open new terminal

2. Change into the API directory:
```
cd GyaanSetuAPI
```
3. Install the requirements locally by:
```
pip install -r requirements.txt
```
4. Run the API on localhost:
```
python3 GyaanSetuAPI.py
```

## Usage

This project requires the use of Azure Cognitive Service APIs.

To use the Azure Cognitive Services APIs, you will need to have an Azure subscription and the necessary API keys. If you don't already have these, you can sign up for a free trial of Azure and obtain the necessary API keys from the Azure portal.

To obtain an Azure subscription:

1. Go to the [Azure website](https://azure.microsoft.com/) and click on the "Free Account" button.
2. Follow the prompts to create a Microsoft account and sign up for the free trial.
3. Once you have an Azure account, you can use the [Azure portal](https://portal.azure.com/) to manage your subscriptions and resources.

To obtain API keys for the Azure Cognitive Services APIs:

1. Go to the [Azure portal](https://portal.azure.com/) and sign in with your Azure account.
2. In the left-hand navigation menu, click on "Create a resource" and search for "Cognitive Services".
3. Select the desired Cognitive Services API from the list and click on the "Create" button.
4. Follow the prompts to create a new Cognitive Services resource. Make sure to select "Yes" when prompted to create a new resource group.
5. Once the resource has been created, click on the "Keys" tab in the resource blade.
6. You will see two keys: a primary key and a secondary key. You can use either key to access the API.
7. Copy the desired key and save it in a secure location. You will need to include this key in the `Ocp-Apim-Subscription-Key` header of your API requests.

To use the Azure Cognitive Services APIs, you will need to make HTTP requests to the appropriate endpoint. The endpoint for each API can be found in the [API documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/).

You can find more information about the Azure Cognitive Services APIs and the available parameters and responses in the [API documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/).

## Credits
- Kush bhargav sah - Back-end
- Bergin prem - Front-end
