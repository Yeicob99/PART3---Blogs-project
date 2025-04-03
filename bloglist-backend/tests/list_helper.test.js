const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

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

describe('most blogs', () => {
  test('returns the author with the most blogs written', () => {
    const result = listHelper.mostBlogs(blogs);

    const expected = {
      author: 'Edsger W. Dijkstra',
      blogs: 2
    };

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
