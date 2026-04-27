const express = require('express');
const mongoose = require('mongoose');
const Student = require('./models/Student'); 

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/student-management')
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.error("Database connection error:", err));

app.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.render('index', { students });
    } catch (err) {
        res.status(500).send("Error fetching students");
    }
});

app.get('/add', (req, res) => {
    res.render('add-student');
});


app.post('/add-student', async (req, res) => {
    try {
        const { name, email, course } = req.body;
        const newStudent = new Student({ name, email, course });
        await newStudent.save();
        res.redirect('/'); 
    } catch (err) {
        res.status(400).send("Error saving student: " );
    }
});
app.get('/delete-student/:id', async (req, res) => {
    try {
        const studentId = req.params.id; 
        await Student.findByIdAndDelete(studentId);
        res.redirect('/'); 
    } catch (err) {
        res.status(500).send("Error deleting student record.");
    }
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});