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
