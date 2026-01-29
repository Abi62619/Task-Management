document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-Btn');
    const taskList = document.getElementById('task-list');

    // 🔹 Load saved tasks
    const savedTasks = JSON.parse(localStorage.getItem("dissertationTasks")) || [];

    savedTasks.forEach(task => {
        addTaskToDOM(task);
    });

    // 🔹 Add task
    addBtn.addEventListener('click', () => {
        if (taskInput.value.trim() !== "") {
            const taskText = taskInput.value.trim();

            addTaskToDOM(taskText);
            saveTask(taskText);

            taskInput.value = "";
        }
    });

    // 🔹 Delete task
    taskList.addEventListener('click', (event) => {
        if (event.target.classList.contains("delete-btn")) {
            const listItem = event.target.parentElement;
            const taskText = listItem.firstChild.textContent.trim();

            listItem.remove();
            deleteTask(taskText);
        }
    });

    // ---------- Helper functions ----------

    function addTaskToDOM(taskText) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            ${taskText}
            <button class="delete-btn">Delete</button>
        `;
        taskList.appendChild(listItem);
    }

    function saveTask(taskText) {
        const tasks = JSON.parse(localStorage.getItem("dissertationTasks")) || [];
        tasks.push(taskText);
        localStorage.setItem("dissertationTasks", JSON.stringify(tasks));
    }

    function deleteTask(taskText) {
        let tasks = JSON.parse(localStorage.getItem("dissertationTasks")) || [];
        tasks = tasks.filter(task => task !== taskText);
        localStorage.setItem("dissertationTasks", JSON.stringify(tasks));
    }

    const tutorNotes = document.querySelector(".notes textarea");

    // 🔹 Load saved notes
    const savedNotes = localStorage.getItem("tutorNotes");
    if (savedNotes) {
        tutorNotes.value = savedNotes;
    }

    // 🔹 Save notes as user types
    tutorNotes.addEventListener("input", () => {
        localStorage.setItem("tutorNotes", tutorNotes.value);
    });

});
