const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // Use your MySQL username
    password: 'Thindal@2010',        // Use your MySQL password
    database: 'task_manager'
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
    console.log("Connected to MySQL Database");
});

// Get All Tasks
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Add a New Task
// Add a New Task with Date Formatting
app.post('/tasks', (req, res) => {
    const { title, description, priority, due_date } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    // Format date to "dd-mm-yyyy"
    const formattedDate = new Date(due_date).toISOString().split('T')[0]; // yyyy-mm-dd

    db.query(
        'INSERT INTO tasks (title, description, priority, due_date) VALUES (?, ?, ?, ?)', 
        [title, description, priority, formattedDate], 
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ id: result.insertId, title, description, priority, due_date: formattedDate, completed: false });
        }
    );
});




// Delete a Task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(204).send();
    });
});

// Toggle Task Completion
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE tasks SET completed = NOT completed WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Task updated" });
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
