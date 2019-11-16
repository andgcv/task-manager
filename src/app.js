const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// Middleware for maintenance mode
// app.use((req, res, next) => {
//     res.status(503).send('Site is currently under maintenance, we will be back online shortly!')
// })

// Will parse incoming JSON to an object so we can access it in request handlers
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('5dcfcbea63e2a02df0ef80b7')
//     // // .populate() to populate a property, .execPopulate() which is going to find the User associated with the task and populate owner with the entire document
//     // await task.populate('owner').execPopulate()
//     // console.log (task.owner)

//     const user = await User.findById('5dcfc9ddd767b92c480321cb')
//     // Will populate the User's tasks. because it's a virtual, nothing actually gets stored in the User document
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()