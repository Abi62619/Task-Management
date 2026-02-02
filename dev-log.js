const logInput = document.getElementById("logInput");
const saveBtn = document.getElementById("saveLog");
const logEntries = document.getElementById("logEntries");

// Load saved logs
let logs = JSON.parse(localStorage.getItem("devLogs")) || [];

function renderLogs() {
    logEntries.innerHTML = "";
    logs.forEach((log, index) => {
        const entry = document.createElement("div");
        entry.className = "log-entry";
        entry.innerHTML = `
            <p>${log}</p>
            <button onclick="deleteLog(${index})">Delete</button>
        `;
        logEntries.appendChild(entry);
    });
}

function deleteLog(index) {
    logs.splice(index, 1);
    localStorage.setItem("devLogs", JSON.stringify(logs));
    renderLogs();
}

saveBtn.addEventListener("click", () => {
    if (logInput.value.trim() === "") return;

    logs.unshift(logInput.value);
    localStorage.setItem("devLogs", JSON.stringify(logs));
    logInput.value = "";
    renderLogs();
});

renderLogs();
