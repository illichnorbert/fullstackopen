const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
//erstelle einen neuen Router = das Objekt das Routen erstellt
const User = require('../models/user')
//importiere mein Usermodul aus user.js. users ist in der MongoDB

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  //hole dir folgendes aus dem Request

    if (!username || username.length < 3) {
    return response.status(400).json({
      error: 'username must be at least 3 characters long'
    })
  }

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  //erstelle ein verschlüsseltes Passwort

  const user = new User({
    //erstelle ein neues UserObjekt
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  //schreibe es in die MongoDB
  response.status(201).json(savedUser)
  //schicke savedUser als JSON zurück
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  //dank des populate(blogs) gehe ich zum Blogmodel und kann title/author finden
  response.json(users)
})

module.exports = usersRouter