const express = require('express');
const router = express.Router();
const { login, register, getDashboard } = require('../controllers/authcontroller');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../model/usersmodel');

router.post('/login', login);
router.post('/register', register);
router.get('/dashboard', authMiddleware, getDashboard);

router.get("/get-user",async (req,res) =>{
    try {
      const data = await User.find()
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })

module.exports = router;
