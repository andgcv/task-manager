const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

// CREATE Task for the currently authenticated User
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

// READ Tasks of currently authenticated User
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    // Add optional filters to the tasks that get displayed to the user
    if (req.query.completed) match.completed = req.query.completed === 'true'

    // Add optional "sort by" support that changes the order of the tasks displayed
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }

    try {
        // Populate the Users task virtual field, with its path, any filters provided
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

// READ Task by ID of currently authenticated User
router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(404).send('Unable to find task')
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

// UPDATE Task by ID of currently authenticated User
router.patch('/tasks/:id', auth, async (req, res) => {
    // Returns an array of strings with our request body keys
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    // If at least one of the request body properties doesn't equal one of the allowedUpdates strings, isValidOperation will be false
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if (!isValidOperation) return res.status(400).send('Invalid updates!')

    try {
        // Find the task by the id we passed in
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(404).send('Unable to find task')
        // Update each value individually
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// DELETE Task by ID of currently authenticated User
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(404).send('Unable to find task')
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router