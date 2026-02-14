const express = require('express');
const router = express.Router();
const Question = require("../model/questionmodel");

router.post("/add-question", async (req, res) => {
    try {
      const newquestion = new Question(req.body);
      await newquestion.save();
      res.send({
        message: "Question added successfully",
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

router.get("/get-question",async (req,res) =>{
      try {
        const data = await Question.find()
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
 
router.get("/get-questionbyid/:id",async (req,res) =>{
      try {
        const data = await Question.findById(req.params.id)
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });   

router.get("/getQuestionBySubjectId/:subjectId",async (req,res) =>{
  
    try {
      const data = await Question.find({subjectId: req.params.subjectId}).populate('subjectId')
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
router.patch('/update-question/:id', async (req, res) => {

    try {
      const { id } = req.params;
      if (!id ) {
        return res.status(400).json({ error: 'Id are required' });
      }
      
      const updatedData = req.body;
      const options = { new: true };

      const updatedQuestion = await Question.findByIdAndUpdate(
          id, updatedData, options
      )
      if (!updatedQuestion) {
        return res.status(404).json({ error: 'Question not found' });
      }
      res.json(updatedQuestion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.delete('/delete-question/:id', async (req, res) => {
  try {
    const deletedquestion = await Question.findByIdAndDelete(req.params.id)
    
    if (!deletedquestion) {
      return res.status(404).json({ message: 'question not found' });
    }

    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;