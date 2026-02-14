import React, { useEffect } from 'react';
import Sidebar from '../../../Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getDashboard } from '../../../redux/authSlice';
import { getUserReports } from '../../../redux/userExamSlice'; 
import './ShowResult.css';

const ShowResult = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Get state from Redux
    const { user, token } = useSelector((state) => state.auth);
    const { userReports, isLoading } = useSelector((state) => state.userExam);

   
        useEffect(() => {
            const storedToken = token || localStorage.getItem("token");

            if (!storedToken) {
                navigate('/');
            } else {
                // Only dispatch if we don't have the user yet
                if (!user) {
                    dispatch(getDashboard()); 
                }
            }
        }, [token]);

       useEffect(() => {
            // Check both possibilities
            const userId = user?._id || user?.id;

            if (userId) {
                console.log("Found ID:", userId);
                dispatch(getUserReports(userId));
            } else if (token) {
                console.log("No User in state yet, fetching from dashboard...");
                dispatch(getDashboard());
            }
        }, [user, token, dispatch]);
        console.log("Reports currently in Redux:", userReports);
    return (
        <div className="admin-container">
            <Sidebar />
            <div className="main-content">
                <header className="navbar">
                    <div className="navbar-inner">
                        <h2 className="navbar-title">My Results</h2>
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

                <main className="page-content">
                    <div className="content-container">
                        <div className="content-card">
                            {isLoading ? (
                                <p>Loading your results...</p>
                            ) : userReports && userReports.length > 0 ? (
                                <table className="results-table">
                                    <thead>
                                        <tr>
                                            <th>Exam Name</th>
                                            <th>Date</th>
                                            <th>Marks Obtained</th>
                                            <th>Verdict</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userReports.map((report) => (
                                            <tr key={report._id}>
                                                <td>{report.exam?.categoryName || "Deleted Exam"}</td>
                                                <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                                                <td>{report.result.marksObtained} / {report.exam?.totalMarks}</td>
                                                <td>
                                                    <span className={`status-badge ${report.result.verdict.toLowerCase()}`}>
                                                        {report.result.verdict}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="no-data">
                                    <p>You haven't attempted any exams yet.</p>
                                    <button onClick={() => navigate('/user-exam')}>Take an Exam</button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ShowResult;