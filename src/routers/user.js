const express = require('express')
const User = require('../models/user')
const router = new express.Router()

// CREATE User
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// READ Users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

// READ User by ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).send('Unable to find user')
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

// UPDATE User by ID
router.patch('/users/:id', async (req, res) => {
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
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) return res.status(404).send('Unable to find user')
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router