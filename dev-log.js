const logInput = document.getElementById("logInput");
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const saveBtn = document.getElementById("saveLog");
const logEntries = document.getElementById("logEntries");

// Load saved logs
let logs = JSON.parse(localStorage.getItem("devLogs")) || [];

function renderLogs() {
    logEntries.innerHTML = "";
    logs.forEach((logObj, index) => {
        const entry = document.createElement("div");
        entry.className = "log-entry";

        // Add image if it exists
        const imgTag = logObj.image ? `<img src="${logObj.image}" style="max-width: 100%; border-radius: 12px; margin-top: 10px;" />` : '';
        
        entry.innerHTML = `
            <p>${logObj.text}</p>
            ${imgTag}
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
    if (logInput.value.trim() === "" && !imageInput.files[0]) return;

    const reader = new FileReader();
    if (imageInput.files[0]) {
        reader.onload = function() {
            const logData = {
                text: logInput.value,
                image: reader.result
            };
            logs.unshift(logData);
            localStorage.setItem("devLogs", JSON.stringify(logs));
            logInput.value = "";
            imageInput.value = ""; // Clear the input
            previewImage.style.display = "none"; // Hide the image preview
            renderLogs();
        };
        // Read in the image file as a data URL
        reader.readAsDataURL(imageInput.files[0]);
    }
});

// Preview the image
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewImage.style.display = "block"; // Show the image preview
        };
        reader.readAsDataURL(file);
    } else {
        previewImage.style.display = "none"; // Hide when no file
    }
});

renderLogs();