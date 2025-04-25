const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('../utils/test_helper');
const Blog = require('../models/blog');
const User = require('../models/user'); // Importa el modelo User

let token = '';

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const newUser = {
    username: 'tester',
    name: 'Test User',
    password: 'password123',
  };

  await api.post('/api/users').send(newUser);

  const loginResponse = await api
    .post('/api/login')
    .send({ username: newUser.username, password: newUser.password });

  token = loginResponse.body.token;

  const userId = loginResponse.body.id; // Obtén el ID del usuario autenticado

  const blogObjects = helper.initialBlogs.map(blog => new Blog({ ...blog, author: userId })); // Asigna el autor
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});

const blogs = [
  {
    _id: '1',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '2',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://example.com/',
    likes: 5,
    __v: 0
  },
  {
    _id: '3',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://example.com/',
    likes: 12,
    __v: 0
  }
];

test('blogs are returned as json', async () => {
  const response = await api.get('/api/blogs'); 
  assert.strictEqual(response.status, 200);
  assert.match(response.headers['content-type'], /application\/json/);
});

describe('most blogs', () => {
  test('returns the author with the most blogs written', () => {
    console.log('Input blogs:', blogs); // Log input
    const result = listHelper.mostBlogs(blogs);
    console.log('Result:', result); // Log output
    const expected = {
      author: 'Edsger W. Dijkstra',
      blogs: 2
    };

    // Ensure result is not undefined or null
    assert.ok(result);
    assert.deepStrictEqual(result, expected);
  });
});

describe('most blogs (isolated)', () => {
  test('returns the author with the most blogs written', () => {
    const testBlogs = [
      { author: 'Author A', likes: 3 },
      { author: 'Author B', likes: 5 },
      { author: 'Author A', likes: 7 },
    ];

    console.log('Input blogs:', testBlogs); // Log input
    const result = listHelper.mostBlogs(testBlogs);
    console.log('Result:', result); // Log output

    const expected = {
      author: 'Author A',
      blogs: 2,
    };

    assert.ok(result);
    assert.deepStrictEqual(result, expected);
  });
});

test('dummy returns one', () => {
  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe('most liked blog', () => {
  test('returns the blog with the most likes', () => {
    const result = listHelper.mostLikedBlog(blogs);
    const expected = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    };
    assert.deepStrictEqual(result, expected);
  });
});

describe('most liked author', () => {
  test('returns the author with the most total likes', () => {
    const result = listHelper.mostLikes(blogs);
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    };
    assert.deepStrictEqual(result, expected);
  });
});

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
    url: 'http://example.com/',
    likes: 5,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test('blogs have an _id property', async () => {
  await api.post('/api/blogs').send(helper.initialBlogs[0]);
  await api.post('/api/blogs').send(helper.initialBlogs[1]);

  const response = await api.get('/api/blogs');
  assert.ok(Array.isArray(response.body) && response.body.length > 0, 'Response body should be a non-empty array');
  
  response.body.forEach(blog => {
    assert.ok(blog._id, 'Each blog should have an _id property');
  });
});

test('a new blog is added', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'John Doe',
    url: 'http://example.com/new-blog', 
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map(blog => blog.title);
  assert.ok(titles.includes('New Blog'));
});

test('a blog without likes property defaults to 0', async () => {
  const newBlog = {
    title: 'Blog sin likes',
    author: 'Anónimo',
    url: 'http://example.com/sin-likes'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
});

test('a blog without title is not added and returns error: 400', async () => {
  const newBlog = {
    author: 'Anónimo',
    url: 'http://example.com/sin-likes',
    likes: 5
  }

  await api
  .post('/api/blogs')
  .send(newBlog)  
  .expect(400)
});

test('a blog without url property is not added and returns error: 400', async () => {
  const newBlog = {
    title: 'Blog sin likes',
    author: 'Anónimo',
    likes: 5
  }

  await api
  .post('/api/blogs')
  .send(newBlog)  
  .expect(400)
});

test('update the likes of a blog', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  const updatedLikes = { likes: blogToUpdate.likes + 10 };

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedLikes)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.likes, updatedLikes.likes);
});

test('a blog cannot be added without a token', async () => {
  const newBlog = {
    title: 'Blog sin token',
    url: 'http://example.com/',
    likes: 2,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401); // Unauthorized
});
