import React, { useEffect, useState } from 'react'
import "./Exam.css";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addsubject } from '../../../redux/authSlice';
import { deletesubject } from '../../../redux/authSlice';
import { updateSubject } from '../../../redux/authSlice';
import Sidebar from '../../../Sidebar';


function Addeditexam() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [subjectid, setSubjectid] = useState("");
  const [data, setData] = useState([]);
  const [ Loading,setLoading] = useState(true);
  const [ error,setError] = useState(null);
  const [subject, setSubjects] = useState([]);
  const [btnname, setBtnname] = useState('Submit');
  
 


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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(btnname == "Submit")
    {
      const resultAction = await dispatch(addsubject({ name }));
      if (addsubject.fulfilled.match(resultAction)) {
        alert("Subject added successfully!");
        window.location.reload();
        navigate('/subject');
      }
    }
    else
    {
      const resultAction = await dispatch(updateSubject({ subjectid, name }));
      if (updateSubject.fulfilled.match(resultAction)) {
        alert("Subject updated successfully!");
        window.location.reload();
        navigate('/subject');
      }
    }
  };
 
  const handleEdit = async (subjectid, name) => {
    // console.log(65, name)
    setSubjectid(subjectid)
    setName(name)
    setBtnname("Update")
  }
   
  const handleDelete = async (id) => {

    const resultAction = await dispatch(deletesubject(id))
    // console.log(96, resultAction.payload.message)
      alert(resultAction.payload.message);
      window.location.reload();
      navigate('/subject');
  };
  
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <Sidebar></Sidebar>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <header className="navbar">
          <div className="navbar-inner">
            <h2 className="navbar-title">Subjects</h2>
          </div>
        </header>
        {/* Page Content */}
        <main className="page-content">
          <div className="content-container">
            <div className="content-card">
              <div className="input-field">
                <input onChange={(e) => setName(e.target.value)} value={name}/>
                <label>Enter Subject name: </label>
                <button  onClick={handleSubmit}>{btnname}</button>
              </div>            
              <div className="table-container">
                <table className="category-table" >
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Category Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((subject,index) => (
                      <tr key={subject._id}>
                        <td>{index+1}</td>
                        <td className="category-name">{subject.name}</td>  
                        <td className="category-name">
                          <button className="edit-button" onClick={(e) => handleEdit(subject._id, subject.name)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button className="delete-button"  onClick={(e) => handleDelete(subject._id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Addeditexam


