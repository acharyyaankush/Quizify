const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        exam:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "exams",
        },
        result:{
            marksObtained: { type: Number, required: true },
            totalMarks: { type: Number, required: true },
            verdict: { type: String, required: true },
        },
    },
    {
        timestamps: true,
    }
);
const reportModel = mongoose.model("reports", reportSchema);
module.exports = reportModel;