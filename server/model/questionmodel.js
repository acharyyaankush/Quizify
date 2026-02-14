const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  subjectId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref:'subjects'
  },
  question: {
    type: String,
    required: true,
  },
  correctOption: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  }
},
 {
    timestamps: true,
});

const Question = mongoose.model("questions", questionSchema);
module.exports = Question;
