const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

//const getTokenFrom = request => {
  //const authorization = request.get('authorization')
  //if (authorization && authorization.startsWith('Bearer ')) {
    //return authorization.replace('Bearer ', '')
  //}
  //return null
//}
//definiere die Funktion getTokenFrom. gebe nur den Token zurück

blogsRouter.get('/', async (request, response) => {
    //wenn du ein get bekommst, geh in die MongoDatabase und finde die Blogs
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  //gib auch die User mit aus wenn du einen Blog holst
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

  const decodedToken = jwt.verify(request.token, config.SECRET)
  //wenn ich so einen request zur Erstellung eines Blogs mache,
  //dann übergebe ich immer auch eine Zeile Authorization = token

  //verify: nimmt SECRET und rechnet Unterschrift neu aus
  // am Ende ist decodedToken das gleiche wie userForToken

  //vorher:()ich rufe getTokenFrom in Bezug auf diese POST Funktion auf...
//jetzt: aus middleware -> middleware Funktion läuft vor blogsRouter.post -> deshalb
//kann ich hier mit request.token aufrufen

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
//Suche in der DB nach User mit dieser ID
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  //Blogs mit user werden gespeichert

  user.blogs = user.blogs.concat(savedBlog._id)
  //hänge dem blogs-array im userDokument folgendes an
  await user.save()
  //speichere den user mit der neuen id des blogs
  response.status(201).json(savedBlog)
})

//Im Kern: Ich finde mit dem Token den User und erstelle dann einen Blog mit diesem User


blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, config.SECRET)
//request.token liegt bereit, weil tokenExtractor vorher gelaufen ist

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (!blog.user) {
  return response.status(403).json({ error: 'blog has no owner' })
}//nur für die Blogs ohne user

  if (blog.user.toString() !== decodedToken.id.toString()) {
    //toString: blog.user ist ein spezielles MongoDB Objekt, decodedToken.id ist schon ein String
    return response.status(403).json({ error: 'only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  //Dieser Blog soll aktualisiert werden

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    //Diese Felder im gefundenen Dokument werden überschrieben.
    //Das ist Shorthand für { title: title, author: author, url: url, likes: likes }.
    { new: true, runValidators: true, context: 'query' }
  )

  response.json(updatedBlog)
})


module.exports = blogsRouter

