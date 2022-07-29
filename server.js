const {MongoClient} = require("mongodb")
const express = require('express')
const id = require('uuid')
const axios = require('axios')
const URL = 'mongodb://localhost:27017/'
const mongoClient = new MongoClient(URL)
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 5000

const db = mongoClient.db('blog');
const posts = db.collection('posts')
const users = db.collection('users')

app.use(cors({
    origin: '*'
}))

app.get("/posts", async (req, res) => {
    try {
        await mongoClient.connect()
        posts.find().toArray((err, results) => {
            res.send(results)
        })
    } catch (err) {
        console.log(err)
    }
})

const urlencodedParser = express.urlencoded({extended: false})

app.post("/add-post", urlencodedParser, (req, res) => {
    if(!req.body) return res.sendStatus(400)
    posts.insertOne({
        title: req.body.title,
        description: req.body.description,
        img: req.body.img,
        fullDate: req.body.fullDate
    })
})

app.delete('/delete-post', (req, res) => {
    res.send("Delete req called")
})

app.post("/login", urlencodedParser, async (req, res) => {
    if(!req.body) return res.sendStatus(400)
    try {
        await mongoClient.connect()
        users.find().toArray((err, results) => {
            console.log(results)
            // console.log(req)
        })
    } catch (err) {
        console.log(err)
    }
})

app.get("/get-user", async (req, res) => {
    // res.send(results)
    try {
        await mongoClient.connect()
        users.find().toArray((err, results) => {
            res.send(results)
        })
    } catch (err) {
        console.log(err)
    }
})

app.post("/set-user", urlencodedParser, async (req, res) => {
    if(!req.body) return res.sendStatus(400)
    await mongoClient.connect()
    db.collection('users').insertOne({
        userName: req.body.userName,
        login: req.body.login,
        password: req.body.password,
        userPhoto: req.body.userPhoto
    })
    // res.send('aooa')
})

app.listen(PORT)