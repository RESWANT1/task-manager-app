const API_URL = "http://localhost:5000/tasks";

// Fetch Tasks from Server
function fetchTasks() {
    fetch(API_URL)
        .then(res => res.json())
        .then(tasks => {
            const taskList = document.getElementById("task-list");
            taskList.innerHTML = "";
            tasks.forEach(task => {
                taskList.innerHTML += `
                    <li class="${task.completed ? 'complete' : ''}">
                        ${task.title}
                        <button onclick="deleteTask(${task.id})">Delete</button>
                        <button onclick="toggleTask(${task.id})">${task.completed ? "Undo" : "Complete"}</button>
                    </li>
                `;
            });
        })
        .catch(err => console.error("Error fetching tasks:", err));
}

// Add a New Task
function addTask() {
    const taskInput = document.getElementById("task-input");
    const title = taskInput.value.trim();
    if (title === "") return alert("Enter a task!");

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
    }).then(() => {
        taskInput.value = "";
        fetchTasks();
    }).catch(err => console.error("Error adding task:", err));
}

// Delete a Task
function deleteTask(id) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    }).then(() => fetchTasks())
      .catch(err => console.error("Error deleting task:", err));
}

// Toggle Task Completion
function toggleTask(id) {
    fetch(`${API_URL}/${id}`, {
        method: "PUT"
    }).then(() => fetchTasks())
      .catch(err => console.error("Error toggling task:", err));
}

// Initial Fetch
fetchTasks();
