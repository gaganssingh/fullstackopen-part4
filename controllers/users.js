const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

// Get all users
usersRouter.get("/", async (req, res) => {
   const response = await User.find({}).populate("blogs", {
      url: 1,
      title: 1,
      author: 1,
   });
   res.json(response);
});

// Create a new user route
usersRouter.post("/", async (req, res) => {
   const body = req.body;

   if (body.username.length < 3) {
      return res.status(400).json({
         error: "username must be atleast 3 characters long",
      });
   }
   if (body.password.length < 3) {
      return res.status(400).json({
         error: "password must be atleast 3 characters long",
      });
   }

   const saltRounds = 10;
   const passwordHash = await bcrypt.hash(body.password, saltRounds);

   const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
   });

   const savedUser = await user.save();

   res.json(savedUser);
});

module.exports = usersRouter;
