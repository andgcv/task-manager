const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

// CREATE Task
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

// READ Tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

// READ Task by ID
router.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) return res.status(404).send('Unable to find task')
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

// UPDATE Task by ID
router.patch('/tasks/:id', async (req, res) => {
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
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) return res.status(404).send('Unable to find task')
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router