const mongoose = require('mongoose')

// Model for Task
const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

const newTask = new Task({
    description: 'Do the laundry.',
    completed: false
})

module.exports = Task