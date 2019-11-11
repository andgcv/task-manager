const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// Add express middleware function
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('Get disabled')
//     } else {
//         next()
//     }
// })

// Will parse incoming JSON to an object so we can access it in request handlers
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})