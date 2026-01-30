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

function openTasks(date) {
    selectedDateKey = date.toISOString().split("T")[0];
    selectedDateTitle.textContent = `Tasks for ${selectedDateKey}`;
    taskPanel.classList.add("open");
    loadTasks();
}

function loadTasks() {
    taskList.innerHTML = "";
    const tasks = JSON.parse(localStorage.getItem(selectedDateKey)) || [];

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.text;
        taskList.appendChild(li);
    });
}

addTaskBtn.addEventListener("click", () => {
    if (!taskInput.value || !selectedDateKey) return;

    const tasks = JSON.parse(localStorage.getItem(selectedDateKey)) || [];
    tasks.push({ text: taskInput.value, createdAt: Date.now() });

    localStorage.setItem(selectedDateKey, JSON.stringify(tasks));
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