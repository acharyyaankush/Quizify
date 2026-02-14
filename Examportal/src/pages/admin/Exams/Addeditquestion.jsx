import React, { useEffect, useState } from 'react'
import "./Exam.css";
import { useNavigate } from 'react-router-dom';
import {  addNewquestion, deletequestion, logoutUser } from '../../../redux/authSlice';
import { useDispatch } from 'react-redux';
import Sidebar from '../../../Sidebar';

function Addeditquestion() {
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [Questions, setQuestions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [ Loading,setLoading] = useState(true);
  const [ error,setError] = useState();
  const [question, setquestion] = useState();
  const [option,setoption] = useState({
    "A":"",
    "B":"",
    "C":"",
    "D":""

  });
  const [correctoption,setcorrectoption] = useState();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectName, setSelectedSubjectName] = useState('');

  const handleOptionChange = (optionKey, value) => {
    setoption(prevOptions => ({
      ...prevOptions,
      [optionKey]: value
    }));
  };

  const EditQuestion = (id) => {
    navigate(`/editquestion/${id}`);
   }

  
  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/auth/get-subject');
          if (!response.ok) {
            throw new Error('response was not ok');
          }
          const result = await response.json();
          // console.log(41,result)
          setSubjects(result);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      const fetchquestiondata = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/auth/get-question');
          if (!response.ok) {
            throw new Error('response not ok');
          }
          const result = await response.json();
          // console.log(61,result)
          setQuestions(result);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
      fetchquestiondata();
    }, []); 

 const handleSubjectChange = async(e) => {
  const selectedValue = e.target.value;
  if(selectedValue=="all"){
    window.location.href="/question"
  }
    else{
      setSelectedSubject(selectedValue);

    const response1 = await fetch(`http://localhost:5000/api/auth/get-subjectbyid/${selectedValue}`);
    const result1 = await response1.json();
    // console.log(94,result1)
    setSelectedSubjectName(result1.name)

    if (selectedValue) {
      //alert(`You selected: ${selectedValue}`);
       try {
          const response = await fetch(`http://localhost:5000/api/auth/getQuestionBySubjectId/${selectedValue}`);
          if (!response.ok) {
            throw new Error('response not ok');
          }
          const result = await response.json();
          // console.log(84,result)
          setQuestions(result);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
    }
    }
  };
  

    const Handlesubmit = async () => {
      const userData = {
        "subjectId":selectedSubject,
        "question" : question,
        "correctOption" : correctoption,
        "options" : option
      }

        const resultAction = await dispatch(addNewquestion(userData));
      //  console.log(120,userData)
      if (addNewquestion.fulfilled.match(resultAction)) {
        // console.log(122,resultAction)
          alert("Question added successfully!");
          window.location.reload();
          navigate('/question');
        }
      };
    
      const handleDelete = async (id) => {

        const resultAction = await dispatch(deletequestion(id))
        // console.log(96, resultAction.payload.message)
          alert(resultAction.payload.message);
          window.location.reload();
          navigate('/question');
      };

  return (
    <>
      <div className="admin-container">
      {/* Sidebar */}
      <Sidebar></Sidebar>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <header className="navbar">
          <div className="navbar-inner">
            <h2 className="navbar-title">Questions</h2>
          </div>
        </header>
        {/* Page Content */}
        <main className="page-content">
          <div className="content-container">
            <div className="content-card">
                <select className="category-dropdown"value={selectedSubject}
                  onChange={handleSubjectChange}>
                    <option value="all">Select Category</option>
                    {subjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.name}
                      </option>
                      ))}
                </select>
                <button className="add-button"onClick={() => setShowPopup(true)}
                disabled={!selectedSubject}>
                Add New Question
              </button>

              {!showPopup && (
              <div className="content-card">
                      <h1>List of All questions</h1><br/>
                      {
                        Questions.map((ques,index) =>
                           <div className="content-questioncard">
                            <h3>{index+1}. {ques.question}</h3>
                            <ol type="A" style={{marginLeft:'40px'}}>
                              <li>{ques.options.A}</li>
                              <li>{ques.options.B}</li>
                              <li>{ques.options.C}</li>
                              <li>{ques.options.D}</li>
                            </ol>
                            <h5 style={{marginBottom:'5px'}}>Correct Option is: {ques.correctOption} </h5>
                          <button type="button" class="btn btn-default" style={{marginRight:'5px'}} onClick={() =>EditQuestion(ques._id)}>Edit</button>
                          <button type="button" class="btn btn-default" onClick={(e) => handleDelete(ques._id)}>Delete</button>
                          </div>
                        )
                      }

              </div>
              )}

              {showPopup && (
                <div className="content-questioncard">
                    <h3>Add New Question to {selectedSubjectName}</h3>
                    <div>
                      <div className="form-group">
                        <label>Question Text:</label>
                        <textarea rows="4" required  onChange={(e) => setquestion(e.target.value)}/>
                      </div>
                      <div className="form-group">
                        <label>Options:</label>
                        <input type="text" placeholder="Option 1" required onChange={(e) => handleOptionChange('A', e.target.value)} value={option.A}/>
                        <input type="text" placeholder="Option 2" required onChange={(e) => handleOptionChange('B', e.target.value)} value={option.B}/>
                        <input type="text" placeholder="Option 3" required onChange={(e) => handleOptionChange('C', e.target.value)} value={option.C}/>
                        <input type="text" placeholder="Option 4" required onChange={(e) => handleOptionChange('D', e.target.value)} value={option.D}/>
                      </div>
                      <select className="category-dropdown" onChange={(e) => setcorrectoption(e.target.value)}>
                        <option value="">Correct option</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                      <div className="button-group">
                        <button type="submit" className="submit-btn" onClick={Handlesubmit}>
                          Add Question
                        </button>
                        <button type="button" className="cancel-btn"onClick={() => setShowPopup(false)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
    </>
  )
}

export default Addeditquestion
