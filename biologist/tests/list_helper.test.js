const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5)
  })

  const blogs = [
    { _id: '1', title: 'Blog A', author: 'A', url: 'a', likes: 7, __v: 0 },
    { _id: '2', title: 'Blog B', author: 'B', url: 'b', likes: 5, __v: 0 },
    { _id: '3', title: 'Blog C', author: 'C', url: 'c', likes: 12, __v: 0 },
  ]

  test('of a bigger list is calculated right', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 24)
  })
})


describe('favorite blog', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  test('when list has one blog, it is the favorite', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      }
    ]

    assert.deepStrictEqual(listHelper.favoriteBlog(listWithOneBlog), listWithOneBlog[0])
  })

  test('of many blogs is the one with most likes', () => {
    const blogs = [
      { _id: '1', title: 'A', author: 'A', url: 'a', likes: 5, __v: 0 },
      { _id: '2', title: 'B', author: 'B', url: 'b', likes: 12, __v: 0 },
      { _id: '3', title: 'C', author: 'C', url: 'c', likes: 3, __v: 0 },
    ]

    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[1])
  })
})

describe('most blogs', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test('when one author has most blogs', () => {
    const blogs = [
      { _id: '1', title: 'A', author: 'Martin', url: 'a', likes: 2, __v: 0 },
      { _id: '2', title: 'B', author: 'Dijkstra', url: 'b', likes: 5, __v: 0 },
      { _id: '3', title: 'C', author: 'Martin', url: 'c', likes: 3, __v: 0 },
      { _id: '4', title: 'D', author: 'Martin', url: 'd', likes: 1, __v: 0 },
    ]

    assert.deepStrictEqual(listHelper.mostBlogs(blogs), {
      author: 'Martin',
      blogs: 3
    })
  })
})

