const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    }
  }
);

const Subject = mongoose.model("subjects", subjectSchema);
module.exports = Subject;
