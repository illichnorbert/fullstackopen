const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async (request, response) => {
  //es wird hierhin weitergeleitet über rest und app.js. request ist
  //username und password (habe ich geschickt)
  const { username, password } = request.body
  //2 neue Variablen

  const user = await User.findOne({ username })
  //Suche in der MongoDB ein Dokument wo Feld username = das was ich geschickt habe
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)
    //es wird geschaut ob user === null, und dann gibt es 2 Optionen
    //nur wenn der user in der MongoDb war (user === null ist false) prüfe ich das Passwort

    //Resultat: falls der username existiert hat, wurde jetzt gerade das Passwort geprüft
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }
  //falls der user nicht gefunden wurde oder das password nicht korrekt war,
  //werfe diese Fehlermeldung.

  const userForToken = {
    username: user.username,
    id: user._id,
  }
  //das, was in den Token soll
  //baue ein neues Objekt mit 2 Attributen. Hole die Attriutee aus dem Mongoobjekt/Dokument user

  const token = jwt.sign(userForToken, config.SECRET, { expiresIn: 60 * 60 })
//Erzeugung des Token: Inhalt, Signatur und Gültigkeit
//jwt: baue aus 3 Parametern einen langen String

  response.status(200).send({
    token,
    username: user.username,
    name: user.name
  })
})
//dann schickt der Server token, username, name an den Rest-Client oder Frontend zurück

module.exports = loginRouter

//POST kommt rein -> app.js wird ausgeführt, Suche nach Übereinstimmung
// Weiterleitung an loginRouter in controllers/login.js