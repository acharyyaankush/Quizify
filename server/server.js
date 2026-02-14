require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mongoString = process.env.MONGO_URL;
const cors = require('cors');
mongoose.connect(mongoString);
const database = mongoose.connection;

app.use(cors({
  origin:"*"
}
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res)=>{
  res.send("Hiiii")
})

const authRoutes = require('./routes/usersroute');
app.use('/api/auth', authRoutes);

const ExamRoutes = require('./routes/examroute');
app.use('/api/auth',ExamRoutes);

const SubjectRoutes = require('./routes/addsubjectroute');
app.use('/api/auth', SubjectRoutes);

const QuestionRoutes = require('./routes/questionroute');
app.use('/api/auth', QuestionRoutes);

const ReportRoutes = require('./routes/reportroute');
app.use('/api/auth', ReportRoutes);

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${5000}`);
      console.log(`Database Connected `);
    });
  })
.catch((err) => console.error('MongoDB connection failed:', err));