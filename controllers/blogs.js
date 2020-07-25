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

   if (!body.title || !body.url) {
      return res.status(400).end();
   }

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

// DELETE a blog post
blogsRouter.delete(`/:id`, async (req, res) => {
   await Blog.findByIdAndRemove(req.params.id);
   res.status(204).end();
});

// PUT - Update a blog post by id
blogsRouter.put(`/:id`, async (req, res, next) => {
   let existingBlog = await Blog.findById(req.params.id);

   const body = req.body;
   const updatedBlog = {
      title: body.title || existingBlog.title,
      author: body.author || existingBlog.author,
      url: body.url || existingBlog.url,
      likes: body.likes || existingBlog.likes,
   };

   const updated = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, {
      new: true,
   });
   res.json(updated);
});

module.exports = blogsRouter;
