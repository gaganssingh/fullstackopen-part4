const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const config = require("./utils/config");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const app = express();

logger.info(`Connecting to MongoDB database`);

// MONGODB / MONGOOSE DB CONNECTION
mongoose
   .connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => logger.info(`Connected to MongoDB`))
   .catch((error) =>
      logger.error(`error connecting to MongoDB: ${error.message}`)
   );

// MIDDLEWARES
app.use(cors()); // Enable cors requests
app.use(express.static("build")); // Static file serving for frontend
app.use(express.json()); // Body parser
app.use(middleware.requestLogger); // general console logger
app.use(middleware.tokenExtractor); // extract authorization token

// Routes
app.use("/api/blogs", blogsRouter); // blogs route
app.use("/api/users", usersRouter); // users route
app.use("/api/login", loginRouter); // login route

// MIDDLEWARES
app.use(middleware.unknownEndpoint); // Catch unknown endpoints
app.use(middleware.errorHandler); // General error handler

module.exports = app;
