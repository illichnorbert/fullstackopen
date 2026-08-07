const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  //suche in der MongoDB
  return blogs.map(blog => blog.toJSON())
  //neues JSObjekt erstellt
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
  //gehe jedes Element im Array durch und wende die Funktion an
}

module.exports = { initialBlogs, blogsInDb, usersInDb}