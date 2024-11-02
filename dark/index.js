let darkmode = localStorage.getItem("darkmode") === "true";
if (darkmode) {
    document.body.classList.add("darkmode");
} else {
    document.body.classList.remove("darkmode");
}

const theme_switch = document.getElementById("theme-switch");
theme_switch.addEventListener("click", () => {
    darkmode = !darkmode;
    if (darkmode) {
        document.body.classList.add("darkmode");
        localStorage.setItem("darkmode", "true");
    } else {
        document.body.classList.remove("darkmode");
        localStorage.setItem("darkmode", "false");
    }
});
