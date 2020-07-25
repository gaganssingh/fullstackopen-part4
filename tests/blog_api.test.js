const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

const helper = require("./test_helper");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
   await Blog.deleteMany({});

   for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog);
      await blogObject.save();
   }
});

describe("Endpoint: /api/blogs", () => {
   test("Ex4.8 - GET all blogs from /api/blogs", async () => {
      await api
         .get("/api/blogs")
         .expect(200)
         .expect("Content-Type", /application\/json/);
   });

   test("Ex4.9 - '_id' is returned as 'id' from the db", async () => {
      const response = await api.get("/api/blogs");
      expect(response.body[0].id).toBeDefined();
   });

   test("Ex4.10 - POST /api/blogs successfully creates a new blog post", async () => {
      const newBlogPost = {
         title: "Test Post",
         author: "Test Author",
         url: "https://www.testsite.com",
         likes: 20,
      };

      await api
         .post("/api/blogs")
         .send(newBlogPost)
         .expect(201)
         .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
   });

   test("Ex4.11 - POST /api/blogs If 'likes' property missing, default to zero", async () => {
      const newBlogPost = {
         title: "Test Post",
         author: "Test Author",
         url: "https://www.testsite.com",
      };

      await api
         .post("/api/blogs")
         .send(newBlogPost)
         .expect(201)
         .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const newlyAddedBlog = blogsAtEnd[blogsAtEnd.length - 1];
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
      expect(newlyAddedBlog.likes).toEqual(0);
   });

   test("Ex4.12 - POST /api/blogs Server responds with 400 Bad Request if 'title' or 'url' missing", async () => {
      const newBlogPost = {
         author: "Test Author",
      };

      await api.post("/api/blogs").send(newBlogPost).expect(400);
   });

   test("Ex4.13 DELETE /api/blogs Delete a blog post from server", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1);

      const titles = blogsAtEnd.map((r) => r.content);
      expect(titles).not.toContain(blogToDelete.title);
   });
});

afterAll(() => {
   mongoose.connection.close();
});
