import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from './redux/authSlice';
import '../src/pages/common/Home/Home.css';
import api from './utils/axios';

function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const addexam = () => {
        navigate('/subject');
       }
       const addquestion = () => {
        navigate('/question');
       }
      const Dashboard= () =>{
        navigate('/Home');
      }
      const handleLogout = () => {
        // ✅ REMOVE TOKEN FROM AXIOS
        delete api.defaults.headers.common["Authorization"];
        dispatch(logoutUser());
        navigate('/');
      }
      const addExam = () => {
        navigate('/add-exam');
      }
      const UserExam= () =>{
        navigate('/user-exam');
      }
      const result= () =>{
        navigate('/result');
      }

      // useEffect(() => {
      //   console.log(30,user);
      // })
  return (
    <>
    <div className="admin-container">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            {isSidebarOpen && <h1 className="sidebar-title">Admin Panel</h1>}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="sidebar-toggle"
            >
              {isSidebarOpen ? '«' : '»'}
            </button>
          </div>
          
          <nav className="sidebar-nav">
            <ul className="nav-list">
              <li>
                <button className="nav-button" onClick={Dashboard}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {isSidebarOpen && <span>Home</span>}
                </button>
              </li>
              {
                user?.isAdmin === "true" ?
                <>
                  <li>
                    <button className="nav-button" onClick={addexam}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {isSidebarOpen && <span>Subject</span>}
                    </button>
                  </li>
                  <li>
                    <button className="nav-button" onClick={addquestion}> 
                      <svg xmlns="http://www.w3.org/2000/svg" className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {isSidebarOpen && <span>Question</span>}
                    </button>
                  </li>
                  <li>
                    <button className="nav-button" onClick={addExam}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      {isSidebarOpen && <span>Add Exam</span>}
                    </button>
                  </li>
                </>
                :
                <>
                  <li>
                    <button className="nav-button"  onClick={UserExam}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                      {isSidebarOpen && <span>Exam</span>}
                    </button>
                  </li>
                  <li>
                    <button className="nav-button" onClick={result}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {isSidebarOpen && <span>Result</span>}
                    </button>
                  </li>
                </>
              }  
              <li>
                <button className="nav-button" onClick={handleLogout}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {isSidebarOpen && <span>Logout</span>}
                </button>
              </li>                        
            </ul>
          </nav>
      </div>
    </div>
    
    </>
  )
}

export default Sidebar
