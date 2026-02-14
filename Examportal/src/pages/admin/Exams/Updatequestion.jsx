import React, { useEffect, useState } from 'react'
import "./Exam.css";
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { updateQuestion } from '../../../redux/authSlice';
import Sidebar from '../../../Sidebar';

function Updatequestion() {
  const navigate = useNavigate();
  const location= useLocation();
  const dispatch = useDispatch();
 
  const[qid,setQid] = useState('');

  const params=useParams();
  const [question, setquestion] = useState();
  const [option,setoption] = useState({
    "A":"",
    "B":"",
    "C":"",
    "D":""

  });
  const [correctoption,setcorrectoption] = useState();
  const handleOptionChange = (optionKey, value) => {
    setoption(prevOptions => ({
      ...prevOptions,
      [optionKey]: value
    }));
  };

  const fetchData = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/get-questionbyid/${id}`);
      if (!response.ok) {
        throw new Error('response was not ok');
      }
      const result = await response.json();
      console.log(41,result);
      setquestion(result.question)
      setoption(result.options)
      setcorrectoption(result.correctOption)
      setQid(result._id)
    } catch (error) {
      setError(error.message);
    } finally {
      //setLoading(false);
    }
  };


  useEffect(()=>{    
    const { id } = params;
    console.log(id)
    fetchData(id)
  }, [])

  const HandleUpdate = async () => {
    const userData = {
      "id": qid,
      "question" : question,
      "correctOption" : correctoption,
      "options" : option
    }

    console.log(66,qid,userData)

      const resultAction = await dispatch(updateQuestion(userData));

    if (updateQuestion.fulfilled.match(resultAction)) {

        alert("Question updated successfully!");
        window.location.reload();
        navigate('/question');
      }
    };
 const HandleCancel= async ()=>{
  
  navigate('/question');
 }

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
            <h2 className="navbar-title">Update Questions</h2>
          </div>
        </header>
        {/* Page Content */}
        <main className="page-content">
          <div className="content-container">
            <div className="content-card">
            <div className="content-questioncard">
                    <div>
                      <div className="form-group">
                        <label>Question Text:</label>
                        <textarea rows="4" value={question} required onChange={(e) => setquestion(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Options:</label>
                        <input type="text" placeholder="Option 1" value={option.A} required onChange={(e) => handleOptionChange('A', e.target.value)}/>
                        <input type="text" placeholder="Option 2" value={option.B} required onChange={(e) => handleOptionChange('B', e.target.value)}/>
                        <input type="text" placeholder="Option 3" value={option.C} required onChange={(e) => handleOptionChange('C', e.target.value)}/>
                        <input type="text" placeholder="Option 4" value={option.D} required onChange={(e) => handleOptionChange('D', e.target.value)}/>
                      </div>
                      <select className="category-dropdown" value={correctoption} onChange={(e) => setcorrectoption(e.target.value)}>
                        <option value="">Correct option</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                      <div className="button-group">
                        <button type="submit" className="submit-btn" onClick={HandleUpdate}>
                          Update Question
                        </button>
                        <button type="button" className="cancel-btn" onClick={HandleCancel}>
                          Cancel
                        </button>
                      </div>
                    </div>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </>
  )
}

export default Updatequestion
