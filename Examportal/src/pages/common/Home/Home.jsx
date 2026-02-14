import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Home.css'; // Import the CSS file
import { getDashboard, logoutUser } from '../../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../Sidebar';
import api from '../../../utils/axios';


const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [User, setUser] = useState([]);
  const [Exam, setExam] = useState([]);
  const [Questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 

  useEffect(() => {
    
    const storedToken = token || localStorage.getItem("token");
    console.log(28, user)
    console.log(29, storedToken)

    if (!storedToken) {
      navigate('/');
    } else {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch(getDashboard());
    }
    

      const fetchSubject = async () => {
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

      const fetchquestiondata = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/auth/get-question');
          if (!response.ok) {
            throw new Error('response not ok');
          }
          const result = await response.json();
          setQuestions(result);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      const fetchuser = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/auth/get-user');
          if (!response.ok) {
            throw new Error('response not ok');
          }
          const result = await response.json();
          setUser(result);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      const fetchexam = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/auth/get-exam');
          if (!response.ok) {
            throw new Error('response not ok');
          }
          const result = await response.json();
          setExam(result);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      

      fetchexam();
      fetchuser();
      fetchSubject();
      fetchquestiondata();
    }, [token, dispatch, navigate]);



  return (
    <div className="admin-container">
      {/* Sidebar */}
      <Sidebar></Sidebar>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <header className="navbar">
          <div className="navbar-inner">
            <h2 className="navbar-title">Dashboard</h2>
            <div className="user-profile">
              <img 
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoqWIPKg9kRQhn9r3qgpcRSACAXvg-dbTOWQiDN6b5ahLRZ-AU_ioL_uXv5Un0kNGPNhE&usqp=CAU' 
                alt="User profile" 
                className="user-avatar"
              />
              <div className="user-info">
                  {user ? (
                    <>
                      <p>{user?.name}</p>
                      <p>{user.isAdmin === "false" ? "User" : "Admin"}</p>
                    </>
                  ) : (
                    <p>Loading user...</p>
                  )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="page-content">
          <div className="content-container">
              {/* Dashboard Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="stat-info">              
                  <h3 className="stat-title">Subject</h3>
                  <p className="stat-value">{data.length}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="stat-info">
                  <h3 className="stat-title">Questions</h3>
                  <p className="stat-value">{Questions.length}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="stat-info">
                  <h3 className="stat-title">Users</h3>
                  <p className="stat-value">{User.length}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="stat-info">
                  <h3 className="stat-title">Exams</h3>
                  <p className="stat-value">{Exam.length}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer>
            <div className="date-time">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;