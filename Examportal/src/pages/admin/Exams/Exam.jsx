import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../../../Sidebar'
import "./Exam.css";
import { addExam } from '../../../redux/authSlice';

const Exam = () => {
    const [data, setData] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [ Loading,setLoading] = useState(true);
    const [Questionno,setQuestionno] = useState('');
    const [Totalmarks,setTotalmarks] = useState('');
    const [Passingmarks,setPassingmarks] = useState('');   
    const [Duration,setDuration] = useState('');
    const [Examdate,setExamdate] = useState('');
    const [status, setstatus] = useState('');
    const [subjectName,setsubjectName] = useState('');
    const [subjectId,setsubjectId] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:5000/api/auth/get-subject');
            if (!response.ok) {
              throw new Error('response was not ok');
            }
            const result = await response.json();
            setData(result);
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, []); 

      const handleSubjectChange = async(e) => {
        const [id, name] = e.target.value.split('|');
        console.log('Selected ID:', id);
        console.log('Selected Name:', name);
        setsubjectId(id);
        setsubjectName(name);
      }

      const handleSubmit = async (id) => {
        const userData = {
          "categoryId":subjectId,
          "categoryName":subjectName,
          "noofQuestion":Questionno,
          "duration":Duration,
          "totalMarks" : Totalmarks,
          "passingMarks" : Passingmarks,
          "ExamDate" : Examdate,
          "status" : "active"
        }
  
          const resultAction = await dispatch(addExam(userData));
         console.log(61,userData)
        if (addExam.fulfilled.match(resultAction)) {
          // console.log(44,resultAction)
            alert("Exam added successfully!");
            window.location.reload();
            navigate('/add-exam');
          }
        };

  return (
    <>
    <div className="admin-container">
    {/* Sidebar */}
    <Sidebar></Sidebar>
        <div className="main-content">
            <header className="navbar">
            <div className="navbar-inner">
                <h2 className="navbar-title">Exams</h2>
            </div>
            </header>
            <main className="page-content">
            <div className="content-container">
                <div className="content-card">
                  <div className="form-container">
                    <label for="subject">Choose Subject name:</label>
                    <select onChange={(e) => handleSubjectChange(e)} id='subject' name='subject'>
                        <option value="all">Select Category</option>
                        {data.map((subject) => (
                         <option key={subject._id} value={`${subject._id}|${subject.name}`}>
                            {subject.name}
                        </option>
                        ))}
                    </select>
                    <label for="questions">Enter no. of questions:</label>
                    <input type="number" onChange={(e) => setQuestionno(e.target.value)} required/>
                    <label for="questions">Enter Total Marks:</label>
                    <input type="number" onChange={(e) => setTotalmarks(e.target.value)} required/>
                    <label for="questions">Enter Passing Marks:</label>
                    <input type="number" onChange={(e) => setPassingmarks(e.target.value)}required/>
                    <label for="questions">Enter Exam Duration:</label>
                    <input type="number"  onChange={(e) => setDuration(e.target.value)}required/>
                    <label for="exam-date">Set A Exam-Date:</label>
                    <input type="date" onChange={(e) => setExamdate(e.target.value)}required/>

                    <div className="status-group">
                      <label>Status:</label>
                      <label><input type="radio" name="status" /> Active</label>
                      <label><input type="radio" name="status" /> Inactive</label>
                    </div>
                    <button className="addbutton" onClick={handleSubmit} required >
                        Add New Exam
                    </button>
                  </div>  
                </div>
            </div>
            </main>  
        </div>       
    </div> 
    </>
  )
}

export default Exam
