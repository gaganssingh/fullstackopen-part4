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
});

afterAll(() => {
   mongoose.connection.close();
});
