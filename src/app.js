const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

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