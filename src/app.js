const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

// Will parse incoming JSON to an object so we can access it in request handlers
app.use(express.json())

// CREATE User
app.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// READ Users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

// READ User by ID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).send('Unable to find user')
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

// UPDATE User by ID
app.patch('/users/:id', async (req, res) => {
    // Returns an array of strings with our request body properties
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    // If at least one of the request body properties doesn't equal one of the allowedUpdates strings, isValidOperation will be false
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) return res.status(400).send('Invalid updates!')

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!user) return res.status(404).send('Unable to find user')
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// DELETE User by ID
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) return res.status(404).send('Unable to find user')
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

// CREATE Task
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

// READ Tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

// READ Task by ID
app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) return res.status(404).send('Unable to find task')
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

// UPDATE Task by ID
app.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if (!isValidOperation) return res.status(400).send('Invalid updates!')

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) return res.status(404).send('Unable to find task')
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// DELETE Task by ID
app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) return res.status(404).send('Unable to find task')
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})