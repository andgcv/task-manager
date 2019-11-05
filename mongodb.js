// CRUD - create, read, update, delete
const mongodb = require('mongodb')
// Needed to initialize the connect
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// Setup connection -> URL, options object, callback function (if error exists, things went wrong, else if client exists, successfully connected)
MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
    if (error) return console.log('Unable to connect to database.')
    

    const db = client.db(databaseName)

    // db.collection('users').insertOne({
    //     name: 'Andre',
    //     age: 22
    // }, (error, result) => {
    //     if (error) return console.log('Unable to insert user')

    //     // ops is an array of documents
    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: "Rui",
    //         age: 26
    //     },
    //     {
    //         name: "Diana",
    //         age: 11
    //     }
    // ], (error, result) => {
    //     if (error) return console.log('Unable to insert users')

    //     console.log(result.ops)
    // })

    db.collection('tasks').insertMany([
        {
            description: 'First task!',
            completed: false
        },
        {
            description: 'Second task?',
            completed: true
        },
        {
            description: 'Third task...',
            completed: true
        }
    ], (error, result) => {
        if (error) return console.log('Unable to insert tasks')

        console.log(result.ops)
    })
})