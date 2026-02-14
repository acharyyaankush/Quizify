const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    noofQuestion: {
      type: Number,
      required: true,
    }, 
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "questions", // This must match the name in your Question model
        }
    ],
    duration: {
      type: Number,
      required: true,
    },   
    totalMarks: {
      type: Number,
      required: true,
    },
    passingMarks: {
      type: Number,
      required: true,
    },
    ExamDate: {
      type: String,
      required: true,
    },
    status:{
      type:String,
      requied: true,
    }
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model("exams", examSchema);
module.exports = Exam;
