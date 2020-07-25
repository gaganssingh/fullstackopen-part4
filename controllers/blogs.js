const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const blog = require("../models/blog");

// GET ALL BLOGS
blogsRouter.get("/", async (req, res) => {
   // Using promise chaining
   // Blog.find({}).then((blogs) => {
   //    res.json(blogs);
   // });

   // Async/await without try catch block
   // using express-async-errors npm package
   const response = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
   });
   res.json(response);
});

// POST NEW BLOG
blogsRouter.post("/", async (req, res) => {
   const body = req.body;

   const decodedToken = jwt.verify(req.token, process.env.SECRET);

   if (!req.token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
   }
   const user = await User.findById(decodedToken.id);

   if (!body.title || !body.url) {
      return res.status(400).end();
   }

   const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
   });

   // Using promise chaining
   // blog.save().then((result) => {
   //    res.status(201).json(result);
   // });

   // Async/await without try catch block
   // using express-async-errors npm package
   const savedBlog = await blog.save();
   user.blogs = user.blogs.concat(savedBlog._id);
   await user.save();

   res.status(201).json(savedBlog);
});

// DELETE a blog post
blogsRouter.delete(`/:id`, async (req, res) => {
   const decodedToken = jwt.verify(req.token, process.env.SECRET);
   if (!req.token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
   }

   let user = await User.findById(decodedToken.id);
   const blogToDelete = await Blog.findById(req.params.id);

   if (blogToDelete.user.toString() === user._id.toString()) {
      blogToDelete.remove();
      return res.status(204).end();
   }
   res.status(400).json({ error: "unauthorized access" });
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
