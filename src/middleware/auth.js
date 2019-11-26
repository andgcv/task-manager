const jwt = require('jsonwebtoken')
const User = require('../models/user')

const jwtSecret = process.env.JWT_SECRET

// Middleware authentication function to authenticate the user's requests
const auth = async (req, res, next) => {
    try {
        // req.header to get access the incoming Authorization token, and remove Bearer from it
        const token = req.header('Authorization').replace('Bearer ', '')
        // Decoded payload for the token
        const decoded = jwt.verify(token, jwtSecret)
        // If the token is valid, proceed and grab the id embedded in the token and find it's user, will also look if the user still has the token value stored.
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) throw new Error('Please authenticate.')

        // Handler stores the current token for when the User chooses to logout of the current session
        req.token = token
        // Handler stores the current user to be displayed when requested
        req.user = user

        next()
    } catch (e) {
        res.status(401).send({ error: e.message })
    }    
}

module.exports = auth