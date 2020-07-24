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
blogsRouter.post("/", (req, res) => {
   const blog = new Blog(req.body);

   blog.save().then((result) => {
      res.status(201).json(result);
   });
});

module.exports = blogsRouter;
