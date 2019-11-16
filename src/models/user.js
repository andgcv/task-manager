const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Please provide a valid email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain the word "password" in it')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.toJSON = function () {
    const user = this
    // Get a raw object with just our User data attached
    const userObject = user.toObject()

    // Remove the password and tokens from the object, which will not be returned in the response
    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    // Create a new token for the user
    const token = jwt.sign({_id: user._id.toString()}, 'andgcv')
    // Store the token in the user document
    user.tokens = user.tokens.concat({ token })
    await user.save()
    
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    // Find user by the email passed in
    const user = await User.findOne({ email })
    // If we can't find an user with the email passed in, throw an error
    if (!user) throw new Error('Unable to login')
    // Check if the password passed in matches the one stored in the user document (hashed)
    const isMatch = await bcrypt.compare(password, user.password)
    // If the password doesn't match, throw an error
    if (!isMatch) throw new Error('Unable to login')

    return user
}

// Before the user is saved, run the function to hash the password
userSchema.pre('save', async function (next) {
    const user = this

    // Check if user modified the password, if true hash the password (will run when user is created and if user updates password later on)
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    // Call next() when we're done
    next()
})

// Model for User
const User = mongoose.model('User', userSchema)

module.exports = User