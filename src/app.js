const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

// Will parse incoming JSON to an object so we can access it in request handlers
app.use(express.json())

// CREATE User
app.post('/users', (req, res) => {
    const user = new User(req.body)
    user.save()
        .then(() => res.status(201).send(user))
        .catch((e) => res.status(400).send(e))
})

// READ Users
app.get('/users', (req, res) => {
    User.find({})
        .then((users) => res.send(users))
        .catch((e) => res.status(500).send(e))
})

// READ User by ID
app.get('/users/:id', (req, res) => {
    const _id = req.params.id
    User.findById(_id)
        .then((user) => {
            if (!user) return res.status(404).send('Unable to find user')
            res.send(user)
        })
        .catch((e) => res.status(500).send(e))
})

// CREATE Task
app.post('/tasks', (req, res) => {
    const task = new Task(req.body)
    task.save()
        .then(() => res.status(201).send(task))
        .catch((e) => res.status(400).send(e))
})

// READ Tasks
app.get('/tasks', (req, res) => {
    Task.find({})
        .then((tasks) => res.send(tasks))
        .catch((e) => res.status(500).send(e))
})

// READ Task by ID
app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id
    Task.findById(_id)
        .then((task) => {
            if (!task) return res.status(404).send('Unable to find task')
            res.send(task)
        })
        .catch((e) => res.status(500).send(e))
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})