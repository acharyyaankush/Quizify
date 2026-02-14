const express = require('express');
const router = express.Router();
const Exam = require("../model/exammodel");
const Question = require("../model/questionmodel");
const Report = require("../model/reportmodel");

router.post("/add-exam", async (req, res) => {
    try {
      console.log(7,req.body)
      const newExam = new Exam(req.body);
      await newExam.save();
      res.send({
        message: "Attempt added successfully",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: error,
        success: false,
      });
    }
});

router.get("/get-exam",async (req,res) =>{
  try {
    const data = await Exam.find()
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET QUESTIONS FOR USER (Secure version)
router.post("/get-exam-questions", async (req, res) => {
  try {
    // 1. Find the exam first to get the categoryId/subjectId
    const exam = await Exam.findById(req.body.examId);
    
    if (!exam) {
      return res.status(404).send({ 
        message: "Exam not found", 
        success: false 
      });
    }

    // 2. Fetch questions that match the exam's category
    // NOTE: Ensure your Question model uses 'subjectId' or 'categoryId' consistently
    const questions = await Question.find({ subjectId: exam.categoryId })
      .select("-correctOption"); // Security: Hide the answer!

    res.send({
      message: "Questions fetched successfully",
      data: questions,
      success: true,
    });
  } catch (error) {
    // This catch block is what's sending the 500 error
    console.log(error); // Check your terminal to see the EXACT error message
    res.status(500).send({ 
      message: error.message, 
      success: false 
    });
  }
});

router.post("/submit-exam", async (req, res) => {
    try {
        const { examId, userId, selectedAnswers } = req.body;

        // 1. Fetch the Exam details
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).send({ message: "Exam not found", success: false });
        }

        // 2. FETCH QUESTIONS MANUALLY using the categoryId from the exam
        // Note: Use the model name you used for questions (e.g., Question)
        const questions = await Question.find({ subjectId: exam.categoryId });

        let marksObtained = 0;
        const totalQuestionsFound = questions.length;
        
        // Calculate marks per question
        const marksPerQuestion = exam.totalMarks / (exam.noofQuestion || totalQuestionsFound || 1);

        console.log(`--- PROCESSING SUBMISSION ---`);
        console.log(88, `Exam: ${exam.categoryName} | Questions Found in DB: ${totalQuestionsFound}`);

        // 3. Loop through the questions we just found
        questions.forEach((question) => {
            const qIdString = question._id.toString();
            const userAnswer = selectedAnswers[qIdString]; 
            const correctAnswer = question.correctOption; 

            // Normalize both to A, B, C, D format
            const userClean = String(userAnswer || "").trim().toUpperCase();
            const correctClean = String(correctAnswer || "").trim().toUpperCase();

            if (userClean !== "" && userClean === correctClean) {
                marksObtained += marksPerQuestion;
                console.log(`✅ Match on ${qIdString}! Score: ${marksObtained}`);
            } else {
                console.log(`❌ Mismatch on ${qIdString}: User [${userClean}] vs DB [${correctClean}]`);
            }
        });

        const verdict = marksObtained >= exam.passingMarks ? "Pass" : "Fail";

        const newReport = new Report({
            user: userId,
            exam: examId,
            result: {
                marksObtained: Math.round(marksObtained),
                totalMarks: exam.totalMarks,
                verdict: verdict
            }
        });

        await newReport.save();
        res.send({ message: "Exam submitted successfully", success: true });

    } catch (error) {
        console.error("SUBMIT ERROR:", error); 
        res.status(500).send({ message: error.message, success: false });
    }
});


module.exports = router;





