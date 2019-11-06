const mongoose = require('mongoose')

const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api'

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const Task = mongoose.model('Task', {
    description: {
        type: String
    },
    completed: {
        type: Boolean
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


// // Schema for each document in the MongoDB
// const User = mongoose.model('User', {
//     name: {
//         type: String
//     },
//     age: {
//         type: Number
//     }
// })

// // Store an User
// const me = new User({
//     name: 'Andre Goncalves',
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