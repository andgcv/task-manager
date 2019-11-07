const mongoose = require('mongoose')
const validator = require('validator')

const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api'

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

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

newTask.save()
    .then((result) => {
        console.log(newTask)
    })
    .catch((error) => {
        console.log('Error!', error)
    })


// Schema for each document in the MongoDB
const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
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
    }
})

// // Store an User
// const me = new User({
//     name: '    Andre Goncalves',
//     email: 'andre@gmail.com  ',
//     password: 'myNewPass',
//     age: 22
// })

// // Save the User instance to the DB
// me.save()
//     .then((result) => {
//         console.log(me)
//     })
//     .catch((error) => {
//         console.log('Error!', error)
//     })