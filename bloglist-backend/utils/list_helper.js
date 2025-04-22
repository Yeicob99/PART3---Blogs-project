const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const fav = blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max;
  });

  return {
    title: fav.title,
    author: fav.author,
    likes: fav.likes,
  };
};

const mostBlogs = (blogs) => {
  console.log('mostBlogs called with:', blogs); // Log input
  if (blogs.length === 0) {
    console.log('No blogs provided'); // Log empty case
    return null;
  }

  const grouped = _.countBy(blogs, 'author');
  console.log('Grouped by author:', grouped); // Log grouped authors

  const topAuthor = _.maxBy(Object.entries(grouped), ([, count]) => count);
  console.log('Top author:', topAuthor); // Log top author

  if (!topAuthor) {
    console.log('No top author found'); // Log missing top author
    return null;
  }

  const result = {
    author: topAuthor[0],
    blogs: topAuthor[1],
  };
  console.log('Result:', result); // Log result
  return result;
};

const mostLikedBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const fav = blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max;
  });

  return {
    title: fav.title,
    author: fav.author,
    likes: fav.likes,
  };
};

const mostLikes = (blogs) => {
  const likesPerAuthor = blogs.reduce((accumulator, blog) => {
    accumulator[blog.author] = (accumulator[blog.author] || 0) + blog.likes;
    return accumulator;
  }, {});

  const topAuthor = _.maxBy(Object.entries(likesPerAuthor), ([author, likes]) => likes);

  return {
    author: topAuthor[0],
    likes: topAuthor[1],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikedBlog,
  mostLikes,
};
