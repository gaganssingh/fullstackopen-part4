const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
   username: { type: String, minlength: 3, required: true, unique: true },
   passwordHash: { type: String, minlength: 3, required: true },
   name: String,
   blogs: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Blog",
      },
   ],
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
      // the passwordHash should not be revealed
      delete returnedObject.passwordHash;
   },
});

module.exports = mongoose.model("User", userSchema);
