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

describe.only("Endpoint: /api/blogs", () => {
   test("GET all blogs from /api/blogs", async () => {
      await api
         .get("/api/blogs")
         .expect(200)
         .expect("Content-Type", /application\/json/);
   });
});

afterAll(() => {
   mongoose.connection.close();
});
