const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

// CREATE User
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// LOGIN endpoint for the User to login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// LOGOUT endpoint for the User to logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        // Delete the token from the User document
        req.user.tokens = req.user.tokens.filter((token) => {
            return req.token !== token.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

// LOGOUT ALL endpoint for the User to logout of all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

// READ User's profile information
router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

// UPDATE User by ID
router.patch('/users/:id', async (req, res) => {
    // Returns an array of strings with our request body keys
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    // If at least one of the request body properties doesn't equal one of the allowedUpdates strings, isValidOperation will be false
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) return res.status(400).send('Invalid updates!')

    try {
        // Find the user by the id we passed in
        const user = await User.findById(req.params.id)
        // Update each value individually
        updates.forEach((update) => user[update] = req.body[update])
        // Run user.save() which will access our Middleware operations
        await user.save()
        if (!user) return res.status(404).send('Unable to find user')
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// DELETE User by ID
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router