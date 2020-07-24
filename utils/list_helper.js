const dummy = (blogs) => {
   return 1;
};

const totalLikes = (blogs) => {
   const likesArr = blogs.map((blog) => blog.likes);
   const reducer = (sum, item) => sum + item;

   return likesArr.reduce(reducer);
};

const favoriteBlog = (blogs) => {
   const max = blogs.reduce((prev, curr) =>
      prev.likes > curr.likes ? prev : curr
   );
   return {
      title: max.title,
      author: max.author,
      likes: max.likes,
   };
};

const mostBlogs = (blogs) => {};

const mostLikes = (blogs) => {};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
