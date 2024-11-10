const Model_EN2TR = "Helsinki-NLP/opus-mt-tc-big-en-tr";
const Model_TR2EN = "Helsinki-NLP/opus-mt-tc-big-tr-en";
let modelName = Model_EN2TR;

const tokenInput = document.getElementById("token-input");
const commitToken = document.getElementById("commit-token");
const inputTextArea = document.getElementById("input-textarea");
const outputTextArea = document.getElementById("output-textarea");
const inputEnglish = document.getElementById("input-english");
const inputTurkish = document.getElementById("input-turkish");
const outputEnglish = document.getElementById("output-english");
const outputTurkish = document.getElementById("output-turkish");

let currentInputLanguage = inputEnglish;
let currentOutputLanguage = outputTurkish;

function selectInputLanguage(language) {
    currentInputLanguage.classList.remove("selected");
    currentInputLanguage = language;
    currentInputLanguage.classList.add("selected");
}

function selectOutputLanguage(language) {
    currentOutputLanguage.classList.remove("selected");
    currentOutputLanguage = language;
    currentOutputLanguage.classList.add("selected");
}

inputEnglish.onclick = () => {
    modelName = Model_EN2TR;
    selectInputLanguage(inputEnglish);
    selectOutputLanguage(outputTurkish);
};
inputTurkish.onclick = () => {
    modelName = Model_TR2EN;
    selectInputLanguage(inputTurkish);
    selectOutputLanguage(outputEnglish);
};
outputEnglish.onclick = () => {
    modelName = Model_TR2EN;
    selectInputLanguage(inputTurkish);
    selectOutputLanguage(outputEnglish);
};
outputTurkish.onclick = () => {
    modelName = Model_EN2TR;
    selectInputLanguage(inputEnglish);
    selectOutputLanguage(outputTurkish);
};

let accessToken = localStorage.getItem("access-token");
if (accessToken !== null && accessToken.length > 0) {
    tokenInput.value = accessToken;
}

commitToken.onclick = () => {
    if (tokenInput.value.length > 0) {
        localStorage.setItem("access-token", tokenInput.value);
        alert("Access token commited.");
    } else {
        localStorage.removeItem("access-token");
        alert("Access token removed.")
    }
};

async function query(data) {
    const response = await fetch(
        `https://api-inference.huggingface.co/models/${modelName}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );
    if (!response.ok) {
        alert("translation request failed!");
    }
    const result = await response.json();
    return result;
}

let debounceTimeout;

inputTextArea.addEventListener("input", () => {
    if (inputTextArea.value.length > 0) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            if (inputTextArea.value.length > 0) {
                query({ inputs: inputTextArea.value }).then((response) => {
                    if (response[0] && response[0]["translation_text"]) {
                        outputTextArea.classList.remove("placeholder");
                        outputTextArea.value = response[0]["translation_text"];
                    }
                });
            }
        }, 700);
    } else {
        outputTextArea.classList.add("placeholder");
        outputTextArea.value = "Translation";
    }
});

inputTextArea.focus();
