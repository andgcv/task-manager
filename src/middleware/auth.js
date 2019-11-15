const jwt = require('jsonwebtoken')
const User = require('../models/user')

// Middleware authentication function to authenticate the user's requests
const auth = async (req, res, next) => {
    try {
        // req.header to get access the incoming Authorization token, and remove Bearer from it
        const token = req.header('Authorization').replace('Bearer ', '')
        // Decoded payload for the token
        const decoded = jwt.verify(token, 'andgcv')
        // If the token is valid, proceed and grab the id embedded in the token and find it's user, will also look if the user still has the token value stored.
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) throw new Error()

        // If the route handlers have already fetched the user, there's no reason to do it again and waste time and resources

        req.user = user

        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }    
}

module.exports = auth