// ----------------- CALENDAR ------------------

let currentDate = new Date();
let selectedDateKey = null;

document.addEventListener("DOMContentLoaded", () => {
    const monthYearElement = document.getElementById("monthYear");
    const datesElement = document.getElementById("dates");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (!monthYearElement || !datesElement) return;

    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    window.updateCalendar = function () {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const totalDays = lastDay.getDate();
        const firstDayIndex = (firstDay.getDay() + 6) % 7;

        monthYearElement.textContent = currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric"
        });

        let html = "";

        const prevLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDayIndex; i > 0; i--) {
            html += `<div class="date inactive">${prevLastDay - i + 1}</div>`;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(year, month, i);
            date.setHours(0, 0, 0, 0);

            const key = date.toISOString().split("T")[0];
            const hasTasks = localStorage.getItem(key);
            const active = date.getTime() === today.getTime() ? "active" : "";

            html += `
                <div class="date ${active}" data-date="${date.toISOString()}">
                    ${i}
                    ${hasTasks ? '<span class="dot"></span>' : ""}
                </div>
            `;
        }

        const remaining = 42 - (firstDayIndex + totalDays);
        for (let i = 1; i <= remaining; i++) {
            html += `<div class="date inactive">${i}</div>`;
        }

        datesElement.innerHTML = html;

        document.querySelectorAll(".date:not(.inactive)").forEach(el => {
            el.addEventListener("click", () => {
                openTasks(new Date(el.dataset.date));
            });
        });
    };

    prevBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });

    nextBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });

    updateCalendar();
    checkTodayTasks();
});

// ---------------- TASKS ----------------

const taskPanel = document.getElementById("taskPanel");
const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const selectedDateTitle = document.getElementById("selectedDateTitle");

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function openTasks(date) {
    selectedDateKey = date.toISOString().split("T")[0];
    selectedDateTitle.textContent = `Tasks for ${selectedDateKey}`;
    taskPanel.classList.add("open");
    loadTasks();
}

function loadTasks() {
    taskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem(selectedDateKey)) || [];

    // 🔧 Upgrade old tasks automatically
    tasks = tasks.map(task => ({
        id: task.id || generateId(),
        text: task.text,
        completed: task.completed || false,
        createdAt: task.createdAt || Date.now()
    }));

    saveTasks(tasks);

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("task-item");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.style.textDecoration = "line-through";
            span.style.opacity = "0.6";
        }

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks(tasks);
            loadTasks(); // re-render styles
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✕";
        deleteBtn.classList.add("delete-task");

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const updated = tasks.filter(t => t.id !== task.id);
            saveTasks(updated);
            loadTasks();
            updateCalendar();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

function saveTasks(tasks) {
    if (tasks.length === 0) {
        localStorage.removeItem(selectedDateKey);
    } else {
        localStorage.setItem(selectedDateKey, JSON.stringify(tasks));
    }
}

addTaskBtn.addEventListener("click", () => {
    if (!taskInput.value || !selectedDateKey) return;

    const tasks = JSON.parse(localStorage.getItem(selectedDateKey)) || [];

    tasks.push({
        id: generateId(),
        text: taskInput.value,
        completed: false,
        createdAt: Date.now()
    });

    saveTasks(tasks);
    taskInput.value = "";

    loadTasks();
    updateCalendar();
    checkTodayTasks();
});

function checkTodayTasks() {
    const todayKey = new Date().toISOString().split("T")[0];
    const notifiedKey = "notified-" + todayKey;

    if (localStorage.getItem(notifiedKey)) return;

    const tasks = JSON.parse(localStorage.getItem(todayKey)) || [];

    if (tasks.length && Notification.permission === "granted") {
        new Notification("📅 Today's Tasks", {
            body: `You have ${tasks.length} task(s) today`
        });
        localStorage.setItem(notifiedKey, "true");
    }
}
