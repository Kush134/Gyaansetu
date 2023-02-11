function createTreeView(json, parentNode, depth) {
    let currentParent = json;  // initialize the current parent node to the top-level json object

    depth = depth || 0;

    for (const key in json) {
        let li;

        if (key === 'paragraphs' || key === 'url' || key === 'atotal_reading_time') {
            li = document.createElement('li');

            if (key === 'url') {
                const a = document.createElement('a');
                a.innerHTML = json[key];
                a.href = json[key];
                a.target = '_blank';
                a.style.color = 'gray';
                li.appendChild(a);
            } else if (key === 'atotal_reading_time') {
                const i = document.createElement('i');
                i.innerHTML = `(${json[key]} seconds)`;
                i.style.color = 'gray';
                li.appendChild(i);
            } else {
                li.innerHTML = json[key];
                li.style.color = 'white';
            }

            parentNode.appendChild(li);
            continue;
        } else {
            li = document.createElement('li');
        }

        const div = document.createElement('div');
        div.style.display = 'inline-block';

        const span = document.createElement('span');
        span.innerHTML = key;
        span.style.color = 'white';

        div.appendChild(span);

        if (key !== 'paragraphs' && key !== 'url') {
            // const line = document.createElement('hr');
            // line.className = 'line';
            // line.style.position = 'relative';
            // line.style.border = '1px solid gray';
            // line.style.width = '100%';
            // div.appendChild(line);

            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'delete-icon';
            deleteIcon.innerHTML = ' <i class="fa fa-thin fa-trash"></i>';
            // deleteIcon.style.position = 'absolute';
            // deleteIcon.style.right = '0';

            div.appendChild(deleteIcon);

            deleteIcon.addEventListener('click', function () {
                li.parentNode.removeChild(li);
                const parentNode = deleteIcon.parentNode;
                parentNode.remove();

                const key = parentNode.firstChild.textContent;
                delete currentParent[key];

                console.log(json);
            });
        }

        li.appendChild(div);

        li.style.paddingLeft = depth * 20 + 'px';

        const ul = document.createElement('ul');

        if (typeof json[key] === 'object' && json[key] !== null) {
            currentParent = json[key];  // update the current parent node
            createTreeView(json[key], ul, depth + 1);
        }

        li.appendChild(ul);

        ul.style.display = 'none';

        if (ul.childNodes.length > 0 && key !== 'paragraphs' && key !== 'url' && key !== 'atotal_reading_time') {
            const icon = document.createElement('i');
            icon.className = 'collapse-icon';
            icon.innerHTML = '<i class="fa fa-thin fa-caret-right"></i> ';

            li.insertBefore(icon, div);

            icon.addEventListener('click', function () {
                if (ul.style.display === 'none') {
                    ul.style.display = 'block';
                } else {
                    ul.style.display = 'none';
                }
                icon.innerHTML = (icon.innerHTML === '<i class="fa fa-thin fa-caret-right"></i> ') ? '<i class="fa fa-thin fa-caret-down"></i> ' : '<i class="fa fa-thin fa-caret-right"></i> ';
            });
        }

        parentNode.appendChild(li);
    }

    let enterText = document.createElement("input");
    enterText.type = "text";
    enterText.placeholder = "Enter key";
    enterText.style.cursor = "pointer";
    enterText.style.color = "white";
    enterText.style.background = "transparent";
    enterText.style.border = "none";  // added this line
    enterText.onfocus = function () {
        if (enterText.innerHTML === "enter text") {
            enterText.innerHTML = "";
            enterText.style.color = "white";
            enterText.style.border = "none";  // added this line
        }
        enterText.style.border = "none";  // added this line
        enterText.style.outline = "none";
    }
    let currentUl = document.createElement("ul");
    parentNode.appendChild(currentUl);
    enterText.onkeyup = function (event) {
        if (event.keyCode === 13) {
            let newKey = enterText.value.trim();
            if (newKey) {
                currentParent[newKey] = { "paragraphs": "" };
                console.log(json);
                let newLi = document.createElement("li");
                newLi.innerHTML = newKey;
                let newUl = document.createElement("ul");
                newLi.appendChild(newUl);
                currentUl.appendChild(newLi);
                // Create a collapse/expand icon
                const icon = document.createElement('i');
                icon.className = 'collapse-icon';
                icon.innerHTML = '<i class="fa fa-thin fa-caret-down"></i> ';
                newLi.insertBefore(icon, newLi.firstChild);
                newUl.style.paddingLeft = (depth) * 20 + 'px';
                // Add an event listener to the icon to toggle the visibility of the child nodes
                icon.addEventListener('click', function () {
                    // toggle the visibility of the child nodes
                    if (newUl.style.display === 'none') {
                        newUl.style.display = 'block';

                        icon.innerHTML = '<i class="fa fa-thin fa-caret-down"></i> ';
                    } else {
                        newUl.style.display = 'none';
                        icon.innerHTML = '<i class="fa fa-thin fa-caret-right"></i> ';
                    }
                });

                currentParent = currentParent[newKey];
                createTreeView(currentParent, newUl, depth + 1);
                enterText.value = "";

                const deleteIcon = document.createElement('i');
                deleteIcon.className = 'delete-icon';
                deleteIcon.innerHTML = ' <i class="fa fa-thin fa-trash"></i>';
                newLi.insertBefore(deleteIcon, newLi.lastChild);
                deleteIcon.addEventListener('click', function () {
                    newLi.parentNode.removeChild(newLi);
                    delete currentParent[newKey];
                    console.log(json);
                });

            }

        }
    }
    parentNode.appendChild(enterText);

}





/* function createTreeView(json, parentNode, depth) {
    // set the default depth to 0
    depth = depth || 0;

    // iterate through the keys in the JSON object
    for (const key in json) {
        // create a new list item for the key
        let li;

        // if the key is equal to "paragraphs" or "url", create a new list item and append it to the parent node
        if (key === 'paragraphs' || key === 'url') {
            li = document.createElement('li');

            // if the key is "url", create an anchor element and set the href to the value of the key
            if (key === 'url') {
                const a = document.createElement('a');
                a.innerHTML = json[key];
                a.href = json[key];
                a.target = '_blank';  // open the link in a new tab
                a.style.color = 'gray';  // change the color of the text to gray
                li.appendChild(a);
            } else {
                li.innerHTML = json[key];
                li.style.color = 'white';
            }

            parentNode.appendChild(li);
            continue;
        } else {
            li = document.createElement('li');
        }

        // create a div element to hold the key and delete icon
        const div = document.createElement('div');
        div.style.display = 'inline-block';

        // create a span element to hold the key
        const span = document.createElement('span');
        span.innerHTML = key;
        span.style.color = 'white';

        // append the span element to the div
        div.appendChild(span);

        // if the key is not equal to "paragraphs", create a delete icon
        if (key !== 'paragraphs' && key !== 'url') {
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'delete-icon';
            deleteIcon.innerHTML = ' <i class="fa fa-thin fa-trash"></i>';

            // append the delete icon to the div
            div.appendChild(deleteIcon);

            // add an event listener to the delete icon to delete the node
            deleteIcon.addEventListener('click', function () {

                // remove the node from the tree view
                li.parentNode.removeChild(li);
                // remove the parent node (the node that contains the delete icon)
                const parentNode = deleteIcon.parentNode;
                parentNode.remove();

                // update the JSON object by deleting the key-value pair corresponding to the deleted node
                const key = parentNode.firstChild.textContent;
                delete json[key];

                // log the updated JSON to the console
                console.log(json);
            });
        }

        // append the div element to the list item
        li.appendChild(div);

        // add the indentation based on the depth
        li.style.paddingLeft = depth * 20 + 'px';

        // create a new unordered list for the child nodes
        const ul = document.createElement('ul');

        // if the value of the key is an object, recursively create a tree view for it
        if (typeof json[key] === 'object' && json[key] !== null) {
            createTreeView(json[key], ul, depth + 1);
        }

        // append the unordered list to the list item
        li.appendChild(ul);

        // hide the child nodes by default
        ul.style.display = 'none';

        // if the unordered list has child nodes, create a collapse/expand icon
        if (ul.childNodes.length > 0 && key !== 'paragraphs' && key !== 'url') {
            const icon = document.createElement('i');
            icon.className = 'collapse-icon';
            icon.innerHTML = '<i class="fa fa-thin fa-caret-right"></i> ';


            li.insertBefore(icon, div);

            // add an event listener to the icon to toggle the visibility of the child nodes
            icon.addEventListener('click', function () {
                // toggle the visibility of the child nodes
                if (ul.style.display === 'none') {
                    ul.style.display = 'block';
                    icon.innerHTML = '<i class="fa fa-thin fa-caret-down"></i> ';
                } else {
                    ul.style.display = 'none';
                    icon.innerHTML = '<i class="fa fa-thin fa-caret-right"></i> ';
                }
            });
        }


        // append the list item to the parent node
        parentNode.appendChild(li);
    }
} */


/*
var json = {
    "Phase-shift keying": {
        "Contents": {},
        "Introduction[edit]": {},
        "Binary phase-shift keying (BPSK)[edit]": {
            "Implementation[edit]": {},
            "Bit error rate[edit]": {}
        },
        "Quadrature phase-shift keying (QPSK)[edit]": {
            "Implementation[edit]": {},
            "Probability of error[edit]": {},
            "Variants[edit]": {
                "Offset QPSK (OQPSK)[edit]": {},
                "SOQPSK[edit]": {},
                "\u03c0/4-QPSK[edit]": {},
                "DPQPSK[edit]": {}
            }
        },
        "Higher-order PSK[edit]": {
            "Bit error rate[edit]": {},
            "Spectral efficiency[edit]": {}
        },
        "Differential phase-shift keying (DPSK)[edit]": {
            "Differential encoding[edit]": {},
            "Demodulation[edit]": {},
            "Example: Differentially encoded BPSK[edit]": {},
            "Definitions[edit]": {}
        },
        "Applications[edit]": {},
        "Mutual information with additive white Gaussian noise[edit]": {},
        "See also[edit]": {},
        "Notes[edit]": {},
        "References[edit]": {},
        "Navigation menu": {
            "\nPersonal tools\n": {},
            "\nNamespaces\n": {},
            "\nViews\n": {},
            "\nNavigation\n": {},
            "\nContribute\n": {},
            "\nTools\n": {},
            "\nPrint/export\n": {},
            "\nIn other projects\n": {},
            "\nLanguages\n": {}
        }
    }
}

const container = document.getElementById('tree-view');
container.innerHTML = "";
console.log(json);
createTreeView(json, container); */

//TODO: Take input of missing data from user
//USER INPUT WALA FUNCTION
/* function createTreeView(json, parentNode, depth) {
    // set the default depth to 0
    depth = depth || 0;

    // iterate through the keys in the JSON object
    for (const key in json) {
        // create a new list item for the key
        let li;

        // if the key is equal to "paragraphs", create a new list item and append it to the parent node
        if (key === 'paragraphs') {
            li = document.createElement('li');
            li.innerHTML = json[key];
            li.style.color = 'white';  // change the color of the text to white
            parentNode.appendChild(li);
            continue;
        } else {
            li = document.createElement('li');
        }

        // create a div element to hold the key and delete icon
        const div = document.createElement('div');
        div.style.display = 'inline-block';

        // create a span element to hold the key
        const span = document.createElement('span');
        span.innerHTML = key;
        span.style.color = 'white';

        // append the span element to the div
        div.appendChild(span);

        // if the key is not equal to "paragraphs", create a delete icon
        if (key !== 'paragraphs') {
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'delete-icon';
            deleteIcon.innerHTML = 'x';

            // append the delete icon to the div
            div.appendChild(deleteIcon);

            // add an event listener to the delete icon to delete the node
            deleteIcon.addEventListener('click', function () {
                // delete the node from the JSON object
                delete json[key];

                // remove the node from the tree view
                li.parentNode.removeChild(li);
            });
        }

        // append the div element to the list item
        li.appendChild(div);

        // add the indentation based on the depth
        li.style.paddingLeft = depth * 20 + 'px';

        // create a new unordered list for the child nodes
        const ul = document.createElement('ul');

        // if the value of the key is an object, recursively create a tree view for it
        if (typeof json[key] === 'object' && json[key] !== null) {
            createTreeView(json[key], ul, depth + 1);
        }

        // append the unordered list to the list item
        li.appendChild(ul);

        // hide the child nodes by default
        ul.style.display = 'none';

        // if the unordered list has child nodes, create a collapse/expand icon
        if (ul.childNodes.length > 0 && key !== 'paragraphs') {
            const icon = document.createElement('i');
            icon.className = 'collapse-icon';
            icon.innerHTML = '+';
            li.insertBefore(icon, div);

            // add an event listener to the icon to toggle the visibility of the child nodes
            icon.addEventListener('click', function () {
                // toggle the visibility of the child nodes
                if (ul.style.display === 'none') {
                    ul.style.display = 'block';
                    icon.innerHTML = '-';
                } else {
                    ul.style.display = 'none';
                    icon.innerHTML = '+';
                }
            });
        }

        // create an input field and a "plus" button for creating new nodes
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter node name';
        input.style.display = 'inline-block';
        input.style.width = '100px';
        input.style.marginRight = '10px';

        const plusButton = document.createElement('button');
        plusButton.innerHTML = '+';
        plusButton.style.display = 'inline-block';

        // append the input field and the "plus" button to the list item
        li.appendChild(input);
        li.appendChild(plusButton);

        // add an event listener to the "plus" button to create a new node
        plusButton.addEventListener('click', function () {
            // get the value from the input field
            const nodeName = input.value;

            // if the input field is not empty, create a new node
            if (nodeName) {
                // add the new node to the JSON object
                json[nodeName] = {};

                // create a new list item for the new node
                const newLi = document.createElement('li');
                newLi.style.paddingLeft = (depth + 1) * 20 + 'px';

                // create a div element to hold the key and delete icon
                const newDiv = document.createElement('div');
                newDiv.style.display = 'inline-block';

                // create a span element to hold the key
                const newSpan = document.createElement('span');
                newSpan.innerHTML = nodeName;
                newSpan.style.color = 'white';

                // append the span element to the div
                newDiv.appendChild(newSpan);

                // create a delete icon
                const deleteIcon = document.createElement('i');
                deleteIcon.className = 'delete-icon';
                deleteIcon.innerHTML = 'x';

                // append the delete icon to the div
                newDiv.appendChild(deleteIcon);

                // add an event listener to the delete icon to delete the node
                deleteIcon.addEventListener('click', function () {
                    // delete the node from the JSON object
                    delete json[nodeName];

                    // remove the node from the tree view
                    newLi.parentNode.removeChild(newLi);
                });

                // append the div element to the list item
                newLi.appendChild(newDiv);

                // create a new unordered list for the child nodes
                const newUl = document.createElement('ul');

                // append the unordered list to the list item
                newLi.appendChild(newUl);

                // hide the child nodes by default
                newUl.style.display = 'none';

                // if the unordered list has child nodes, create a collapse/expand icon
                if (newUl.childNodes.length > 0) {
                    const icon = document.createElement('i');
                    icon.className = 'collapse-icon';
                    icon.innerHTML = '+';
                    newLi.insertBefore(icon, newDiv);

                    // add an event listener to the icon to toggle the visibility of the child nodes
                    icon.addEventListener('click', function () {
                        // toggle the visibility of the child nodes
                        if (newUl.style.display === 'none') {
                            newUl.style.display = 'block';
                            icon.innerHTML = '-';
                        } else {
                            newUl.style.display = 'none';
                            icon.innerHTML = '+';
                        }
                    });
                }

                // append the new list item to the parent node
                ul.appendChild(newLi);

                // clear the input field
                input.value = '';
            }
        });
        // append the list item to the parent node
        parentNode.appendChild(li);

    }
} */