const express = require('express');
const router = express.Router();
const Subject = require("../model/addsubjectmodel");

router.post("/add-subject", async (req, res) => {
    try {
      const newSubject = new Subject(req.body);
      await newSubject.save();
      res.send({
        message: "Subject added successfully",
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

router.get("/get-subject",async (req,res) =>{
    try {
      const data = await Subject.find()
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })

router.get("/get-subjectbyid/:id",async (req,res) =>{
      try {
        const data = await Subject.findById(req.params.id)
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });   

  router.patch('/update-subject/:id', async (req, res) => {
   
    try {
      const { name } = req.body;
      
      if (!name ) {
        return res.status(400).json({ error: 'Name are required' });
      }
      const updatedSubject = await Subject.findByIdAndUpdate(
        req.params.id,
        { name },
        { new: true, runValidators: true }
      );
      if (!updatedSubject) {
        return res.status(404).json({ error: 'Subject not found' });
      }
      res.json(updatedSubject);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.delete('/delete-subject/:id', async (req, res) => {
    try {
      const deletedSubject = await Subject.findByIdAndDelete(req.params.id)
      
      if (!deletedSubject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
  
      res.json({ message: 'Subject deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
module.exports = router;