// ---------------- NAVIGATION ----------------
const navs = document.querySelectorAll('.nav-list li');
const sections = document.querySelectorAll('.section');

navs.forEach((item, idx) => {
    item.addEventListener('click', () => {
        document.querySelector('.nav-list li.active')?.classList.remove('active');
        item.classList.add('active');

        sections.forEach(sec => sec.classList.remove('active'));
        sections[idx].classList.add('active');

        // Update counter when switching to Game section
        if (sections[idx].querySelector("#taskAmount")) {
            updateTaskAmount();
        }
    });
});

// ---------------- SELECT ELEMENTS ----------------
const alertMessage = document.querySelector('.alert');
const noneInputsContainer = document.querySelector('.none-inputs');

const addTask = document.getElementById("addTask");
const clearAllButton = document.querySelector(".clear-btn");

const dateInput = document.getElementById("taskDueDate");
const addTaskName = document.getElementById("taskName");
const prioritySelect = document.getElementById("priority");

const allTasksButton = document.getElementById("allTasks");
const activeTasksButton = document.getElementById("activeTasks");
const completedTasksButton = document.getElementById("completedTasks");

const taskList = document.getElementById("tasksListing");
const tableRows = taskList ? taskList.getElementsByTagName("tr") : [];

// ---------------- ADD TASK ----------------
if (addTask) {
    addTask.addEventListener("click", () => {
        if (validateTaskInput()) {
            addTaskToTable();
            noneInputsContainer.style.display = "block";
        } else {
            alertMessage.classList.remove("d-none");
            setTimeout(() => alertMessage.classList.add("d-none"), 2500);
        }
    });
}

// ---------------- CLEAR TASKS ----------------
if (clearAllButton) {
    clearAllButton.addEventListener("click", clearAllTasks);
}

// ---------------- VALIDATION ----------------
let taskName, dueDate, priority;

function validateTaskInput() {
    taskName = addTaskName.value.trim();
    dueDate = dateInput.value;
    priority = prioritySelect.value;
    return taskName !== "" && dueDate !== "" && priority !== "";
}

// ---------------- CREATE TASK ----------------
function addTaskToTable() {
    const taskRow = createTaskRow(taskName, dueDate, priority);
    taskList.appendChild(taskRow);

    saveTasksToMemory();
    updateTaskAmount();

    addTaskName.value = "";
    dateInput.value = "";
    prioritySelect.selectedIndex = 0;

    clearAllButton.classList.toggle("d-none", taskList.getElementsByTagName("tr").length <= 1);
    if (allTasksButton) allTasksButton.click();
}

function createTaskRow(taskName, dueDate, priority) {
    const taskRow = document.createElement("tr");

    const statusCell = document.createElement("td");
    statusCell.textContent = "Active";
    statusCell.style.fontWeight = "bold";

    const taskDescription = document.createElement("td");
    taskDescription.textContent = taskName;

    const priorityCell = document.createElement("td");
    priorityCell.textContent = priority;
    if (priority === "High Priority") {
        priorityCell.style.textDecoration = "underline";
        priorityCell.style.color = "#ff0000";
    } else if (priority === "Low Priority") {
        priorityCell.style.textDecoration = "underline";
        priorityCell.style.color = "#FFD700";
    }

    const dueDateCell = document.createElement("td");
    dueDateCell.textContent = new Date(dueDate).toLocaleDateString("en-US");

    // --- Buttons ---
    const editButton = document.createElement("button");
    editButton.innerHTML = 'Edit';
    editButton.addEventListener("click", () => {
        taskDescription.setAttribute("contenteditable", "true");
        taskDescription.focus();
    });

    taskDescription.addEventListener("blur", () => {
        taskDescription.removeAttribute("contenteditable");
        saveTasksToMemory();
        updateTaskAmount();
    });

    const completeButton = document.createElement("button");
    completeButton.innerHTML = '✔';
    completeButton.addEventListener("click", () => {
        statusCell.textContent = "Completed";
        taskDescription.style.textDecoration = "line-through";
        taskDescription.style.fontWeight = "bold";
        taskDescription.style.color = "green";
        saveTasksToMemory();
        updateTaskAmount();
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '🗑';
    deleteButton.addEventListener("click", () => {
        taskRow.remove();
        saveTasksToMemory();
        updateTaskAmount();
        if (taskList.getElementsByTagName("tr").length <= 1) {
            noneInputsContainer.style.display = "none";
            clearAllButton.classList.add("d-none");
        }
    });

    const actionsCell = document.createElement("td");
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(completeButton);
    actionsCell.appendChild(deleteButton);

    taskRow.appendChild(statusCell);
    taskRow.appendChild(taskDescription);
    taskRow.appendChild(priorityCell);
    taskRow.appendChild(dueDateCell);
    taskRow.appendChild(actionsCell);

    return taskRow;
}

// ---------------- CLEAR FUNCTION ----------------
function clearAllTasks() {
    const rows = taskList.getElementsByTagName("tr");
    for (let i = rows.length - 1; i > 0; i--) rows[i].remove();
    noneInputsContainer.style.display = "none";
    clearAllButton.classList.add("d-none");
    localStorage.removeItem("tasks");
    updateTaskAmount();
}

// ---------------- MEMORY ----------------
function saveTasksToMemory() {
    const rows = taskList.getElementsByTagName("tr");
    const tasksArray = [];
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        tasksArray.push({
            status: cells[0].textContent,
            name: cells[1].textContent,
            priority: cells[2].textContent,
            dueDate: cells[3].textContent
        });
    }
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

// ---------------- LOAD MEMORY ----------------
window.addEventListener("load", () => {
    if (!taskList) return;

    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => {
        const taskRow = createTaskRow(task.name, task.dueDate, task.priority);
        const statusCell = taskRow.querySelector("td");
        const taskDescription = taskRow.querySelector("td:nth-child(2)");

        if (task.status === "Completed") {
            statusCell.textContent = "Completed";
            taskDescription.style.textDecoration = "line-through";
            taskDescription.style.fontWeight = "bold";
            taskDescription.style.color = "green";
        }

        taskList.appendChild(taskRow);
    });

    noneInputsContainer.style.display = savedTasks.length ? "block" : "none";
    clearAllButton.classList.toggle("d-none", savedTasks.length === 0);
    updateTaskAmount();
});

// ---------------- FILTERS ----------------
if (allTasksButton) allTasksButton.addEventListener("click", showAllTasks);
if (activeTasksButton) activeTasksButton.addEventListener("click", showActiveTasks);
if (completedTasksButton) completedTasksButton.addEventListener("click", showCompletedTasks);

function showAllTasks() {
    for (let i = 1; i < tableRows.length; i++) tableRows[i].removeAttribute("hidden");
}
function showActiveTasks() {
    for (let i = 1; i < tableRows.length; i++) {
        tableRows[i].querySelector("td").textContent === "Active" ?
            tableRows[i].removeAttribute("hidden") :
            tableRows[i].setAttribute("hidden", "true");
    }
}
function showCompletedTasks() {
    for (let i = 1; i < tableRows.length; i++) {
        tableRows[i].querySelector("td").textContent === "Completed" ?
            tableRows[i].removeAttribute("hidden") :
            tableRows[i].setAttribute("hidden", "true");
    }
}

// ---------------- TASK AMOUNT ----------------
function updateTaskAmount() {
    const taskAmountSpan = document.getElementById("taskAmount");
    if (!taskAmountSpan) return;
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    taskAmountSpan.textContent = savedTasks.length;
}

// Run task counter on page load
window.addEventListener("load", updateTaskAmount);

// Update counter if localStorage changes (another tab)
window.addEventListener("storage", updateTaskAmount);
