const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const blogSchema = mongoose.Schema({
   title: { type: String, minlength: 5, required: true },
   author: { type: String, minlength: 2, required: true },
   url: { type: String, required: true },
   likes: { type: Number },
});

// Changes the default returned json object to
// have "id" instead of "_id" and delete "__v"
blogSchema.set("toJSON", {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
   },
});

module.exports = mongoose.model("Blog", blogSchema);
