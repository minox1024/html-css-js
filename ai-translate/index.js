const Model_EN2TR = "Helsinki-NLP/opus-mt-tc-big-en-tr";
const Model_TR2EN = "Helsinki-NLP/opus-mt-tc-big-tr-en";
const Model_EN2ZH = "Helsinki-NLP/opus-mt-en-zh";
const Model_ZH2EN = "Helsinki-NLP/opus-mt-zh-en";
let modelName = Model_EN2TR;

const tokenInput = document.getElementById("token-input");
const commitToken = document.getElementById("commit-token");
const inputTextArea = document.getElementById("input-textarea");
const outputTextArea = document.getElementById("output-textarea");
const inputEnglish = document.getElementById("input-english");
const inputTurkish = document.getElementById("input-turkish");
const inputChinese = document.getElementById("input-chinese");
const outputEnglish = document.getElementById("output-english");
const outputTurkish = document.getElementById("output-turkish");
const outputChinese = document.getElementById("output-chinese");

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
    selectInputLanguage(inputEnglish);
    inputTextArea.focus();
};
inputTurkish.onclick = () => {
    selectInputLanguage(inputTurkish);
    inputTextArea.focus();
};
inputChinese.onclick = () => {
    selectInputLanguage(inputChinese);
    inputTextArea.focus();
};
outputEnglish.onclick = () => {
    selectOutputLanguage(outputEnglish);
    inputTextArea.focus();
};
outputTurkish.onclick = () => {
    selectOutputLanguage(outputTurkish);
    inputTextArea.focus();
};
outputChinese.onclick = () => {
    selectOutputLanguage(outputChinese);
    inputTextArea.focus();
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

function translateNothing() {
    outputTextArea.classList.remove("placeholder");
    outputTextArea.value = inputTextArea.value;
}

function translateModel() {
    query({ inputs: inputTextArea.value }).then((response) => {
        if (response[0] && response[0]["translation_text"]) {
            outputTextArea.classList.remove("placeholder");
            outputTextArea.value = response[0]["translation_text"];
        }
    });
}

function translateBetween(source, target) {
    modelName = source;
    query({ inputs: inputTextArea.value }).then((response) => {
        if (response[0] && response[0]["translation_text"]) {
            modelName = target;
            query({ inputs: response[0]["translation_text"] }).then((res) => {
                if (res[0] && res[0]["translation_text"]) {
                    outputTextArea.classList.remove("placeholder");
                    outputTextArea.value = res[0]["translation_text"];
                }
            });
        }
    });
}

function translateEnglishToTurkish() {
    modelName = Model_EN2TR;
    translateModel();
}

function translateEnglishToChinese() {
    modelName = Model_EN2ZH;
    translateModel();
}

function translateTurkishToEnglish() {
    modelName = Model_TR2EN;
    translateModel();
}

function translateTurkishToChinese() {
    translateBetween(Model_TR2EN, Model_EN2ZH);
}

function translateChineseToEnglish() {
    modelName = Model_ZH2EN;
    translateModel();
}

function translateChineseToTurkish() {
    translateBetween(Model_ZH2EN, Model_EN2TR);
}

function translate() {
    if (currentInputLanguage === inputEnglish) {
        if (currentOutputLanguage === outputEnglish) {
            translateNothing();
        }
        if (currentOutputLanguage === outputTurkish) {
            translateEnglishToTurkish();
        }
        if (currentOutputLanguage === outputChinese) {
            translateEnglishToChinese();
        }
    }
    if (currentInputLanguage === inputTurkish) {
        if (currentOutputLanguage === outputEnglish) {
            translateTurkishToEnglish();
        }
        if (currentOutputLanguage === outputTurkish) {
            translateNothing();
        }
        if (currentOutputLanguage === outputChinese) {
            translateTurkishToChinese();
        }
    }
    if (currentInputLanguage === inputChinese) {
        if (currentOutputLanguage === outputEnglish) {
            translateChineseToEnglish();
        }
        if (currentOutputLanguage === outputTurkish) {
            translateChineseToTurkish();
        }
        if (currentOutputLanguage === outputChinese) {
            translateNothing();
        }
    }
}

let debounceTimeout;

inputTextArea.addEventListener("input", () => {
    if (inputTextArea.value.length > 0) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            if (inputTextArea.value.length > 0) {
                translate();
            }
        }, 700);
    } else {
        outputTextArea.classList.add("placeholder");
        outputTextArea.value = "Translation";
    }
});

inputTextArea.focus();
