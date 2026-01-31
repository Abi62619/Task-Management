// ---- CONFIG ----
const careerName = "career";
const STORAGE_KEY = `career-tasks:${careerName}`;

// ---- STATE ----
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let indexToBeDeleted = null;

// ---- ELEMENTS ----
const taskManagerContainer = document.querySelector(".taskManager");
const confirmEl = document.querySelector(".confirm");
const confirmedBtn = document.querySelector(".careerConfirmed");
const cancelledBtn = document.querySelector(".careerCancel");

// ---- EVENTS ----
document
  .getElementById("careerTaskForm")
  .addEventListener("submit", handleFormSubmit);

// ---- FUNCTIONS ----
function handleFormSubmit(e) {
  e.preventDefault();

  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  tasks.push({ text: taskText, completed: false });
  saveTasks();
  taskInput.value = "";
  renderTasks();
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  const taskContainer = document.getElementById("taskContainer");
  taskContainer.innerHTML = "";

  tasks.forEach((task, index) => {
    const taskCard = document.createElement("div");
    taskCard.className = `taskCard ${task.completed ? "completed" : "pending"}`;

    const taskText = document.createElement("p");
    taskText.textContent = task.text;

    const status = document.createElement("p");
    status.className = "status";
    status.textContent = task.completed ? "Completed" : "Pending";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "button-box";
    toggleBtn.innerHTML = `<span class="green">${
      task.completed ? "Mark as Pending" : "Mark as Completed"
    }</span>`;
    toggleBtn.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "button-box";
    deleteBtn.innerHTML = `<span class="red">Delete</span>`;
    deleteBtn.onclick = () => {
      indexToBeDeleted = index;
      confirmEl.style.display = "block";
      taskManagerContainer.classList.add("overlay");
    };

    taskCard.append(taskText, status, toggleBtn, deleteBtn);
    taskContainer.appendChild(taskCard);
  });
}

function deleteTask() {
  tasks.splice(indexToBeDeleted, 1);
  saveTasks();
  renderTasks();
}

// ---- CONFIRM MODAL ----
confirmedBtn.onclick = () => {
  confirmEl.style.display = "none";
  taskManagerContainer.classList.remove("overlay");
  deleteTask();
};

cancelledBtn.onclick = () => {
  confirmEl.style.display = "none";
  taskManagerContainer.classList.remove("overlay");
};

// ---- INIT ----
renderTasks();