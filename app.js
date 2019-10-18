const express = require('express')
const mongoose = require('mongoose')
const app = express()
const User = require('./model/User')
const redis = require('./redis')

mongoose.connect('mongodb://johny:qwerty123@ds235658.mlab.com:35658/user', { useNewUrlParser: true }, err => {
  if (err) console.log("error: ", err)
})

app.get('/newUser', async (req, res) => {
  const user = new User({
    name: "opor",
    password: "qwerty123"
  })
  await user.save()
  res.status(200).send("new complete!!")
})

const cachingUser = async (req, res, next) => {
  const users = await redis.get('users')
  if (users) {
    return res.status(200).json(JSON.parse(users))
  }
  next()
}

app.get('/users', cachingUser, async (req, res) => {
  const user = await User.find({})
  await redis.set('users', JSON.stringify(user))
  res.status(200).json(user)
})

app.listen(8080, err => {
  if (err) console.log(err)
})