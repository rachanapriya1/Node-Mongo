const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://martharachanapriya:rachana@cluster0.slfu0k8.mongodb.net/',
{
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch((error) => {
  console.error("MongoDB connection error:", error);
});

app.get("/", (req, res) => {
  res.send("Welcome to the Home API!");
});


const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    mobileNumber: String
});
const Person = mongoose.model('Person', personSchema);

// GET /person: Display a table with a list of people
app.get('/person', async (req, res) => {
    try {
        const people = await Person.find();
        res.json(people);
    } catch (err) {
        res.status(500).send(err);
    }
});

// POST /person: Display a form to create a single person
app.post('/person', async (req, res) => {
    const { name, age, gender, mobileNumber } = req.body;
    const person = new Person({ name, age, gender, mobileNumber });
    try {
        const newPerson = await person.save();
        res.status(201).json(newPerson);
    } catch (err) {
        res.status(400).send(err);
    }
});

// PUT /person/{id}: Display a form through which a person with a specified id parameter can be edited and updated
app.put('/person/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, gender, mobileNumber } = req.body;
    try {
        const updatedPerson = await Person.findByIdAndUpdate(id, { name, age, gender, mobileNumber }, { new: true });
        res.json(updatedPerson);
    } catch (err) {
        res.status(400).send(err);
    }
});

// DELETE /person/{id}: Display a page through which a person with a specified id can be deleted
app.delete('/person/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Person.findByIdAndDelete(id);
        res.send('Person deleted successfully');
    } catch (err) {
        res.status(400).send(err);
    }
});

// Server Listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// sample POST a new person
//  {
//   "name": "Ajay",
//   "age": "32",
//   "gender": "male",
//   "mobileNumber": "9988675784"
//  }