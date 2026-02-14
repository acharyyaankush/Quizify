const User = require('../model/usersmodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      user: { id: user._id, email: user.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  console.log(27,req.body)
  const { email, name, password,isAdmin } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, password: hashedPassword,isAdmin });


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      user: { id: user._id, email: user.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    // user is already attached from authMiddleware
    const user = req.user;
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // console.log(55,user)
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name:user.name,
        isAdmin:user.isAdmin
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
