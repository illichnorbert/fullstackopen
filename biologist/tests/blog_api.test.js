const { test, after, beforeEach, describe } = require('node:test')
//hole mir aus dem Modul node:test test, after, beforeEach
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
//importiere die App
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)
//Übergebe die ganze App an supertest

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  //füge vor allen Tests die Blogs aus test_helper.js ein
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
//await wartet, bis der ganze request durch ist

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')

  const firstBlog = response.body[0]
  assert.strictEqual(firstBlog.id !== undefined, true)
})


test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Testing async/await',
    author: 'Norbert',
    url: 'https://example.com/testing',
    likes: 3,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  //ich prüfe direkt, ob die Anzahl der Blogs +1 ist
  //habe dazu in test_helper.js eine Funktion definiert
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('Testing async/await'))
})


test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Norbert',
    url: 'https://example.com/no-likes',
    // likes fehlt absichtlich
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    //Funktion blogsInDB aus helper(zu Beginn importiert) wird aufgerufen
    //und umbenannt
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    //Das ist die Überprüfung. initialBlogs muss ich -1 machen

    const titles = blogsAtEnd.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))
    // DER Titel des blogsToDelete darf nicht mehr drin sein
  })
})


describe('updating a blog', () => {
  test('succeeds in updating likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    //ich benenne den Blog, der upgedatet werden soll um. Es ist der erste den ich mit blogsInDb gefunden habe 
    const updatedData = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    }

    const result = await api
    //result ist das responseObjekt, das nach der Ausführung zurückkommt
      .put(`/api/blogs/${blogToUpdate.id}`)
      //Weiterleitung an app.js, Weiterleitung an blogsRouter in controllers/blogs.js
      .send(updatedData)
      //!!!!!updatedData und request.body in controllers/blogs.js sind das Gleiche
      .expect(200)
      .expect('Content-Type', /application\/json/)
      // result ist letztendlich response.json(updatedBlog) aus controllers/blogs.js

    assert.strictEqual(result.body.likes, blogToUpdate.likes + 1)
    //blogToUpdate ist der alte den ich vor der Aktual. rausgeholt habe
  })
})


after(async () => {
  await mongoose.connection.close()
})