// CRUD - create, read, update, delete
// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const { MongoClient, ObjectId } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// Setup connection -> URL, options object, callback function (if error exists, things went wrong, else if client exists, successfully connected)
MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
    if (error) return console.log('Unable to connect to database.')
    

    const db = client.db(databaseName)

    // db.collection('users').findOne({_id: new ObjectID("5dc1cfdb4efc9502faa267cc")}, (error, user) => {
    //     if (error) return console.log('Unable to fetch')

    //     console.log(user)
    // })

    // db.collection('users').find({age: 22}).toArray((error, users) => {
    //     console.log(users)
    // })

    // db.collection('users').find({age: 22}).count((error, count) => {
    //     console.log(count)
    // })

    // db.collection('tasks').findOne({_id: new ObjectId("5dc1d09f5cda2503add68f1a")}, (error, task) => {
    //     if (error) return console.log('Unable to fetch')

    //     console.log(task)
    // })

    // db.collection('tasks').find({completed: false}).toArray((error, tasks) => {
    //     if (error) return console.log('Unable to fetch')

    //     console.log(tasks)
    // })

    // updateOne returns a promise
    // db.collection('users').updateOne({
    //     _id: new ObjectId("5dc1cfdb4efc9502faa267cc")
    // }, {
    //     $inc: {
    //         age: 1
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('users').deleteMany({
    //     age:22
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').deleteMany({
    //     desc: 'Third task...'
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })
})