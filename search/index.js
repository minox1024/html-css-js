let availableKeywords = [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "SQL",
    "C",
    "C++",
    "C#",
    "Rust",
    "Java",
    "Go",
    "Python",
    "Lua"
];

const inputBox = document.querySelector(".input-box");
const resultBox = document.querySelector(".result-box");

inputBox.addEventListener("input", (event) => {
    let result = [];
    const input = event.target.value;
    if (input.length) {
        result = availableKeywords.filter((keyword) => {
            return keyword.toLowerCase().includes(input.toLowerCase());
        });
    }
    if (result.length) {
        displayResult(result);
    } else {
        resultBox.innerHTML = "";
    }
});

function displayResult(result) {
    const content = result.map((item) => {
        return "<li onclick='selectInput(this)'>" + item + "</li>";
    });
    resultBox.innerHTML = "<ul>" + content.join("") + "</ul>";
}

function selectInput(item) {
    inputBox.value = item.innerHTML;
    resultBox.innerHTML = "";
}
