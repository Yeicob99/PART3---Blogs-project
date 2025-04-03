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
  const grouped = _.countBy(blogs, 'author');

  const topAuthor = _.maxBy(
    Object.entries(grouped),
    ([author, count]) => count
  );

  return {
    author: topAuthor[0],
    blogs: topAuthor[1],
  };
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
