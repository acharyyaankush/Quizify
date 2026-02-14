const express = require('express');
const router = express.Router();
const Report = require("../model/reportmodel");
const mongoose = require('mongoose');

router.post("/add-report", async (req, res) => {
    try {
      const newReport = new Report(req.body);
      await newReport.save();
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



router.post("/get-reports-by-user", async (req, res) => {
    try {
        const { userId } = req.body;
        
        // This query looks for reports matching the specific User ID
        const reports = await Report.find({ 
            user: userId 
        })
        .populate("exam")
        .sort({ createdAt: -1 });

        res.send({
            message: "Reports fetched successfully",
            data: reports,
            success: true,
        });
    } catch (error) {
        res.status(500).send({ message: error.message, success: false });
    }
});

module.exports = router;