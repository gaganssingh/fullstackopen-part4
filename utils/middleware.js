const logger = require("./logger");

// Logger
const requestLogger = (req, res, next) => {
   console.log("Method: ", req.method);
   console.log("Path: ", req.path);
   console.log("Body: ", req.body);
   console.log("---");
   next();
};

// Unknown route middleware
const unknownEndpoint = (req, res) => {
   res.status(404).send({ error: "unknown endpoint" });
};

// Error handler
const errorHandler = (error, req, res, next) => {
   console.error(error.message);

   if (error.name === "CastError") {
      return res.status(400).send({ error: "Invalid/malformatted id" });
   } else if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
   }
   next(error);
};

// Helper function to get get authorization token
const tokenExtractor = (req, res, next) => {
   const authorization = req.get("authorization");
   if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
      req.token = authorization.substring(7);
   }
   next();
};

module.exports = {
   requestLogger,
   unknownEndpoint,
   errorHandler,
   tokenExtractor,
};
