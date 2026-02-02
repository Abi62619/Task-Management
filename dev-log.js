const logInput = document.getElementById("logInput");
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const saveBtn = document.getElementById("saveLog");
const logEntries = document.getElementById("logEntries");
const logDate = document.getElementById("logDate");

// Load saved logs from localStorage
let logs = JSON.parse(localStorage.getItem("devLogs")) || [];

// Render logs
function renderLogs() {
    logEntries.innerHTML = "";

    logs.forEach((logObj, index) => {
        const entry = document.createElement("div");
        entry.className = "log-entry";

        const imgTag = logObj.image
            ? `<img src="${logObj.image}" style="max-width: 100%; border-radius: 12px; margin-top: 10px;" />`
            : "";

        entry.innerHTML = `
            <p><strong>${logObj.date}</strong></p>
            <p>${logObj.text}</p>
            ${imgTag}
            <button onclick="deleteLog(${index})">Delete</button>
        `;

        logEntries.appendChild(entry);
    });
}

// Delete log
function deleteLog(index) {
    logs.splice(index, 1);
    localStorage.setItem("devLogs", JSON.stringify(logs));
    renderLogs();
}

// Save log
saveBtn.addEventListener("click", () => {
    if (logInput.value.trim() === "" && !imageInput.files[0]) return;

    const selectedDate =
        logDate.value || new Date().toISOString().split("T")[0];

    const reader = new FileReader();

    if (imageInput.files[0]) {
        reader.onload = function () {
            const logData = {
                text: logInput.value,
                image: reader.result,
                date: selectedDate
            };

            logs.unshift(logData);
            localStorage.setItem("devLogs", JSON.stringify(logs));

            resetInputs();
            renderLogs();
        };

        reader.readAsDataURL(imageInput.files[0]);
    } else {
        const logData = {
            text: logInput.value,
            image: null,
            date: selectedDate
        };

        logs.unshift(logData);
        localStorage.setItem("devLogs", JSON.stringify(logs));

        resetInputs();
        renderLogs();
    }
});

// Preview image
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        previewImage.style.display = "none";
    }
});

// Reset inputs after save
function resetInputs() {
    logInput.value = "";
    imageInput.value = "";
    logDate.value = "";
    previewImage.style.display = "none";
}

// Initial render
renderLogs();