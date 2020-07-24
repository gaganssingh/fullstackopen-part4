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
   test("Ex. 4.8 - GET all blogs from /api/blogs", async () => {
      await api
         .get("/api/blogs")
         .expect(200)
         .expect("Content-Type", /application\/json/);
   });

   test("Ex. 4.9 - '_id' is returned as 'id' from the db", async () => {
      const response = await api.get("/api/blogs");
      expect(response.body[0].id).toBeDefined();
   });

   test.only("Ex. 4.10 - POST /api/blogs successfully creates a new blog post", async () => {
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
});

afterAll(() => {
   mongoose.connection.close();
});
