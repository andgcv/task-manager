const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const jwtSecret = process.env.JWT_SECRET

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
                throw new Error('Password cannot contain the word password in it')
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
}, {
    timestamps: true
})

// Setup a virtual so that mongoose can look for each User's tasks
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// Method used to choose which information we want to return to the User on the endpoint response
userSchema.methods.toJSON = function () {
    const user = this
    // Get a raw object with just our User data attached
    const userObject = user.toObject()

    // Remove the password and tokens from the object, which will not be returned in the response
    delete userObject.password
    delete userObject.tokens

    return userObject
}

// Method used to generate an Authentication Token which will be stored in the User document
userSchema.methods.generateAuthToken = async function () {
    const user = this
    // Create a new token for the user
    const token = jwt.sign({_id: user._id.toString()}, jwtSecret)
    // Store the token in the user document
    user.tokens = user.tokens.concat({ token })
    await user.save()
    
    return token
}

// Static method used to authenticate the information passed in so the User can login
userSchema.statics.findByCredentials = async (email, password) => {
    // Find user by the email passed in
    const user = await User.findOne({ email })
    // If we can't find an user with the email passed in, throw an error
    if (!user) {
        throw new Error('Unable to login')
    }
    // Check if the password passed in matches the one stored in the user document (hashed)
    const isMatch = await bcrypt.compare(password, user.password)
    // If the password doesn't match, throw an error
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

// Hash the password of the User, before the User is saved
userSchema.pre('save', async function (next) {
    const user = this

    // Check if user modified the password, if true hash the password (will run when user is created and if user updates password later on)
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    // Call next() when we're done
    next()
})

// Delete User tasks when User is removed from the database
userSchema.pre('remove', async function (next) {
    const user = this
    // Delete all tasks that have the owner field equal to the currently authenticated User's ID
    await Task.deleteMany({ owner: user._id })
    next()
})

// Model for User
const User = mongoose.model('User', userSchema)

module.exports = User