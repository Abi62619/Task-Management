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


//----------------- CALENDAR ------------------

document.addEventListener("DOMContentLoaded", () => {
    const monthYearElement = document.getElementById('monthYear');
    const datesElement = document.getElementById('dates');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!monthYearElement || !datesElement) return;

    let currentDate = new Date();

    function updateCalendar() {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);

        const totalDays = lastDay.getDate();

        // Convert JS Sunday start → Monday start
        const firstDayIndex = (firstDay.getDay() + 6) % 7;
        const lastDayIndex = (lastDay.getDay() + 6) % 7;

        const monthYearString = currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric'
        });

        monthYearElement.textContent = monthYearString;

        let datesHTML = '';

        // Previous month's ending days
        const prevLastDay = new Date(currentYear, currentMonth, 0).getDate();
        for (let i = firstDayIndex; i > 0; i--) {
            datesHTML += `<div class="date inactive">${prevLastDay - i + 1}</div>`;
        }

        // Current month days
        const today = new Date();
        today.setHours(0,0,0,0); // remove time

        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(currentYear, currentMonth, i);
            date.setHours(0,0,0,0);

            const isToday = date.getTime() === today.getTime();
            const activeClass = isToday ? 'active' : '';

            datesHTML += `<div class="date ${activeClass}">${i}</div>`;
        }

        // Next month's starting days
        const remaining = 42 - (firstDayIndex + totalDays);
        for (let i = 1; i <= remaining; i++) {
            datesHTML += `<div class="date inactive">${i}</div>`;
        }

        datesElement.innerHTML = datesHTML;
    }

    // Buttons
    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });

    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });

    // 🔥 THIS WAS MISSING
    updateCalendar();
});


//------------- Task Manager ---------------
const taskInput = document.getElementById("taskInput");
const timeInput = document.getElementById("timeInput"); // NEW
const priorityInput = document.getElementById("priorityInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskTableBody = document.getElementById("taskTableBody");
const taskAmountSpan = document.getElementById("taskAmount");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
    taskTableBody.innerHTML = "";

    tasks.forEach((task, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.time}</td>
            <td>${task.priority}</td>
            <td>
                <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleCompleted(${index}, this)">
            </td>
            <td>
                <button class="delete-btn" onclick="deleteTask(${index})">
                    Delete
                </button>
            </td>
        `;

        // Add strikethrough style if completed
        if (task.completed) {
            row.style.textDecoration = "line-through";
            row.style.opacity = "0.6";
        }

        taskTableBody.appendChild(row);
    });

    updateTaskAmount();
    updateTasksCompleted(); // NEW
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleCompleted(index, checkbox) {
    tasks[index].completed = checkbox.checked;
    renderTasks();
}


// Add task
addTaskBtn.addEventListener("click", () => {
    const taskName = taskInput.value.trim();
    const timeNeeded = timeInput.value.trim(); // NEW
    const priority = priorityInput.value;

    if (taskName === "" || timeNeeded === "") {
        alert("Please enter task AND time needed!");
        return;
    }

    tasks.push({
        name: taskName,
        time: timeNeeded,   // NEW
        priority: priority
    });

    taskInput.value = "";
    timeInput.value = ""; // clear time field

    renderTasks();
});

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// Update counter
function updateTaskAmount() {
    taskAmountSpan.textContent = tasks.length;
}

const tasksCompletedSpan = document.getElementById("tasksCompleted");

function updateTasksCompleted() {
    const completedCount = tasks.filter(task => task.completed).length;
    tasksCompletedSpan.textContent = completedCount;
}

// Load saved tasks
renderTasks();

//------------- Time ------------------
addTaskBtn.addEventListener("click", () => {
    const taskName = taskInput.value.trim();
    const timeNeeded = timeInput.value; // now a date or month string
    const priority = priorityInput.value;

    if (taskName === "" || timeNeeded === "") {
        alert("Please enter task AND time needed!");
        return;
    }

    tasks.push({
        name: taskName,
        time: timeNeeded, 
        priority: priority
    });

    taskInput.value = "";
    timeInput.value = ""; // clear after adding

    renderTasks();
});

//-------------Timer------------------
const Days = document.getElementById('days'); 
const Hours = document.getElementById('hours'); 
const Minutes = document.getElementById('minutes');
const Seconds = document.getElementById('seconds'); 

const targetDate = new Date("2026-03-06T00:00:00").getTime();

function timer() {
    const currentDate = new Date().getTime(); 
    const distance = targetDate - currentDate; 

    const days = Math.floor(distance / (1000 * 60 * 60 * 24)); 
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24); 
    const minutes = Math.floor((distance / (1000 * 60)) % 60); 
    const seconds = Math.floor((distance / 1000) % 60);

    Days.innerHTML = days; 
    Hours.innerHTML = hours; 
    Minutes.innerHTML = minutes; 
    Seconds.innerHTML = seconds; 
}

setInterval(timer, 1000);
timer(); // run once immediately
