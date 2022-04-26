"use strict";

/**
 * This will log every spendings on the page.
 * Every data will be saved inside the local storage.
 * Data will not be lost on refresh.
 * @author Jeremy Tang
 */
document.addEventListener("DOMContentLoaded", setup);

const form = document.querySelector("form");
const main = document.querySelector("main"); //This is where the logs will be added

/**
 * Sets up the document: initializes required elements
 */
function setup() {
    form.addEventListener("submit", submit);

    document.logs = []; // set up array in the dom

    document.logs = loadSpending(); // Load logs from the local storage
    document.logs.forEach(log => addToDom(log)); // Populate the Dom from the local storage
    checkSection();
}

/**
 * Validates inputs, stores info into global array and local storage, and adds log to DOM
 * @param {Object} e - event
 */
function submit(e) {
    e.preventDefault();
    if (amount.value == 0) {
        amount.setCustomValidity("Please enter a valid amount");

    }
    else if (/[0-9]{1,4}\.[0-9]{3}/.test(amount.value)) {
        amount.setCustomValidity("Please enter a valid amount");
    }
    else if (/[0-9]{1,4}\.[0-9]{2}/.test(amount.value)) {
        amount.setCustomValidity("");

        document.logs.push(readInput()); //Store logs to global array from the returned value of the function readInput()
        addToDom(readInput());

        resetForm();
        updateLocalStorage(document.logs); //Update logs to local storage
    }
}
/**
 * This function automatically adds decimals to the amount spent input field
 * @param {*} el 
 */
function setTwoNumberDecimal(el) {
    el.value = parseFloat(el.value).toFixed(2);
};

/**
 * This function will reset the form for the user to input new values without having to erase the previous ones
 */
function resetForm() {
    checkSection();
    Array.from(document.forms).forEach(
        form => form.reset()
    )
}

/**
 * This function will read the input by the user and return a logOBJ
 * @returns {Object} logOBJ - json object for the log
 */
function readInput() {
    const date = document.querySelector("#date").value;
    const textarea = document.querySelector("textarea").value;
    const amount = document.querySelector("#amount").value;
    const category = document.querySelector('input[type="radio"]:checked').value;

    let logOBJ = { Date: date, Description: textarea, AmountSpent: amount, Category: category };
    return logOBJ;
}

/**
 * This will delete the log from the global array and storage
 * @param {Object} e - event
 */
function checkedAction(e) {
    let child = e.currentTarget.closest("section");
    let parent = child.parentNode;

    document.logs.splice(Array.prototype.indexOf.call(parent.children, child), 1); // Remove from the global array
    updateLocalStorage(document.logs); // Update the local storage

    e.currentTarget.closest("section").remove(); //Remove from the DOM
    checkSection();
}

/**
 * Update logs to local Storage
 * @param {Object[]} logs - array of logs (json objects)
 */
function updateLocalStorage(logs) {
    localStorage.setItem('logs', JSON.stringify(logs));
}

/**
 * Load logs from local storage
 * @returns {Array}
 */
function loadSpending() {
    if (localStorage.getItem('logs')) {
        return JSON.parse(localStorage.getItem('logs'))
    }
    return [];
}

/**
 * Checks for section and changes the margin of .container accordingly
 */
function checkSection() {
    if (document.querySelector('section') != null) {
        document.querySelector('.container').style.margin = "5% 0px 2em"
    } else {
        document.querySelector('.container').style.margin = "5% 0px 10em"
    }
}

/**
 * Add Log to DOM
 * @param {Object} log - log json object
 */
function addToDom(log) {
    let section = document.createElement("section");
    main.appendChild(section);

    //Color coded Sections for different Categories
    if (log.Category == "School") {
        section.style.backgroundColor = 'rgba(74, 165, 100, 0.9)';
    }
    else if (log.Category == "Entertainment") {
        section.style.backgroundColor = 'rgba(2, 191, 231, 0.9)';
    }
    else if (log.Category == "Food") {
        section.style.backgroundColor = 'rgba(249, 198, 66, 0.9)';
    }
    else { // Else = Other
        section.style.backgroundColor = 'rgb(220, 228, 239, 0.9)';
    }

    let inputs = [log.Category, log.AmountSpent, log.Description, log.Date];

    /**
     * Appends the log and keep the CSS in a consistent way
     */
    inputs.forEach(input => {
        if (input == log.Category) {
            let div1 = document.createElement("div");
            let ul = document.createElement("ul");
            section.appendChild(div1);
            div1.appendChild(ul);
            let h3 = document.createElement("h3");
            h3.textContent = input;
            let p = document.createElement("p");
            p.textContent = "$" + log.AmountSpent;
            ul.appendChild(h3);
            ul.appendChild(p);

            //Add stars based on the amount spent on a single log
            let stars = document.createElement("h2");
            if (log.AmountSpent >= 750) {
                stars.textContent = '\u2606\u2606\u2606'; //Add 3 stars if spendings is equal or over 750$
            }
            else if (log.AmountSpent >= 500) {
                stars.textContent = '\u2606\u2606'; // Add 2 stars if spendings is equal or over 500$
            }
            else if (log.AmountSpent >= 100) { // Add 1 star if spendings is equal or over 100$
                stars.textContent = '\u2606';
            }

            div1.appendChild(stars);
        }
        else if (input == log.Description) {
            let div = document.createElement("div");
            section.appendChild(div);
            let h4 = document.createElement("h4");
            h4.textContent = input;
            div.appendChild(h4);
        }
        else if (input == log.Date) {
            let div = document.createElement("div");
            section.appendChild(div);
            let p = document.createElement("p");
            p.textContent = input;
            div.appendChild(p);
            let btn = document.createElement("button");
            btn.textContent = "delete";
            div.appendChild(btn);
            btn.addEventListener("click", checkedAction);
        }
    })
}
