const Model_EN2TR = "Helsinki-NLP/opus-mt-tc-big-en-tr";
let modelName = Model_EN2TR;

const tokenInput = document.getElementById("token-input");
const commitToken = document.getElementById("commit-token");
const inputTextArea = document.getElementById("input-textarea");
const outputTextArea = document.getElementById("output-textarea");

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
    const result = await response.json();
    return result;
}

inputTextArea.addEventListener("input", () => {
    if (inputTextArea.value.length > 0) {
        query({ inputs: inputTextArea.value }).then((response) => {
            outputTextArea.value = response[0]["translation_text"];
        });
    } else {
        outputTextArea.value = "Translation";
    }
});
