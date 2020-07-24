const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

// GET ALL BLOGS
blogsRouter.get("/", async (req, res) => {
   // Using promise chaining
   // Blog.find({}).then((blogs) => {
   //    res.json(blogs);
   // });

   // Async/await without try catch block
   // using express-async-errors npm package
   const response = await Blog.find({});
   res.json(response);
});

// POST NEW BLOG
blogsRouter.post("/", async (req, res) => {
   const body = req.body;

   const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
   });

   // Using promise chaining
   // blog.save().then((result) => {
   //    res.status(201).json(result);
   // });

   // Async/await without try catch block
   // using express-async-errors npm package
   const result = await blog.save();
   res.status(201).json(result);
});

module.exports = blogsRouter;
