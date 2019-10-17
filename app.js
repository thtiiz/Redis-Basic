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
    name: "johny",
    password: "qwererer"
  })
  await user.save()
  res.status(200).send('Create user success!!!')
})

const cachingUser = async (req, res, next) => {
  const hit = await redis.get('users')
  if (hit) {
    return res.json(JSON.parse(hit))
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