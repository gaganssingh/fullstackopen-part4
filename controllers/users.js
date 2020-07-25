const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

// Get all users
usersRouter.get("/", async (req, res) => {
   const response = await User.find({});
   res.json(response);
});

// Create a new user route
usersRouter.post("/", async (req, res) => {
   const body = req.body;

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
