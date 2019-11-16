const mongoose = require('mongoose')

// Task Schema
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

// Model for Task
const Task = mongoose.model('Task', taskSchema)

module.exports = Task