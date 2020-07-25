const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require("../app");

const helper = require("./test_helper");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");

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

describe("When there is initially one user in db", () => {
   beforeEach(async () => {
      await User.deleteMany({});

      const passwordHash = await bcrypt.hash("sekret", 10);
      const user = new User({ username: "root", passwordHash });

      await user.save();
   });

   test("creation succeeds with a fresh username", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
         username: "testuser",
         name: "Test User",
         password: "testpassword",
      };

      await api
         .post("/api/users")
         .send(newUser)
         .expect(200)
         .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

      const usernames = usersAtEnd.map((u) => u.username);
      expect(usernames).toContain(newUser.username);
   });
});

describe.only("When creating a new user", () => {
   beforeEach(async () => {
      await User.deleteMany({});

      const passwordHash = await bcrypt.hash("sekret", 10);
      const user = new User({ username: "root", passwordHash });

      await user.save();
   });

   test("Ex4.16 POST /api/users User creation fails when password less than 3 characters", async () => {
      const usersAtStart = await helper.usersInDb();

      const invalid = {
         username: "testusername",
         name: "user name",
         password: "12",
      };

      const result = await api
         .post("/api/users")
         .send(invalid)
         .expect(400)
         .expect("Content-Type", /application\/json/);

      expect(result.body.error).toContain(
         "password must be atleast 3 characters long"
      );

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
   });

   test("Ex4.16 POST /api/users User creation fails when username less than 3 characters", async () => {
      const usersAtStart = await helper.usersInDb();

      const invalidUser = {
         username: "u",
         name: "user name",
         password: "1234567",
      };

      const result = await api
         .post("/api/users")
         .send(invalidUser)
         .expect(400)
         .expect("Content-Type", /application\/json/);

      expect(result.body.error).toContain(
         "username must be atleast 3 characters long"
      );

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
   });
});

afterAll(() => {
   mongoose.connection.close();
});
