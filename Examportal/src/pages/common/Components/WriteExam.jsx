import React, { useEffect, useState } from 'react';
import Sidebar from '../../../Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getDashboard } from '../../../redux/authSlice';
import { getAllExams, getQuestionsForExam, submitExam, clearExamState, getUserReports } from '../../../redux/userExamSlice'; 
import './WriteExam.css';

const WriteExam = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { user, token } = useSelector((state) => state.auth);
    const { allExams, currentExamQuestions, isLoading } = useSelector((state) => state.userExam);

    const [view, setView] = useState('list'); 
    const [selectedExam, setSelectedExam] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(() => {
        const storedToken = token || localStorage.getItem("token");
        if (!storedToken) {
            navigate('/');
        } else {
            dispatch(getDashboard());
            dispatch(getAllExams());
        }
    }, [dispatch, navigate, token]);

    const handleStartExam = (exam) => {
        setSelectedExam(exam);
        setView('instructions'); // Moves to the instructions screen
    };

    const startQuiz = () => {
        dispatch(getQuestionsForExam(selectedExam._id)); 
        setSecondsLeft(selectedExam.duration * 60);
        setView('quiz'); // Moves to the actual quiz
    };

    useEffect(() => {
        let interval = null;
        if (view === 'quiz' && secondsLeft > 0) {
            interval = setInterval(() => setSecondsLeft(prev => prev - 1), 1000);
        } else if (secondsLeft === 0 && view === 'quiz') {
            handleFinalSubmit();
        }
        return () => clearInterval(interval);
    }, [view, secondsLeft]);

   const handleFinalSubmit = async () => {
    try {
        const payload = {
            examId: selectedExam._id,
            userId: user?._id || user?.id, // Support both id naming conventions
            selectedAnswers
        };

        console.log(61,payload)
        
        const response = await dispatch(submitExam(payload));
        console.log(62, "Full Dispatch Response:", response);
        // Check if payload exists to avoid the 'undefined' error
        if (response.payload && response.payload.success) {
            // Success logic
            dispatch(getUserReports(user?._id || user?.id)); 
            navigate('/result');
        } else {
            // Handle case where API returns success: false
            const errorMsg = response.payload?.message || "Submission failed";
            alert(errorMsg);
        }
        } catch (error) {
            console.error("Submission error:", error);
            alert("An unexpected error occurred during submission.");
        }
    };

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="main-content">
                <header className="navbar">
                    <div className="navbar-inner">
                        <h2 className="navbar-title">
                            {view === 'quiz' ? `Timer: ${Math.floor(secondsLeft / 60)}:${secondsLeft % 60}` : "My Exams"}
                        </h2>
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
                        {isLoading && <p>Loading data...</p>}

                        {/* VIEW 1: EXAM LIST */}
                        {view === 'list' && (
                            <div className="exam-grid">
                                {allExams.map((exam) => (
                                    <div key={exam._id} className="content-card">
                                        <h3>{exam.categoryName}</h3>
                                        <p>Questions: {exam.noofQuestion}</p>
                                        <p>Duration: {exam.duration} mins</p>
                                        <button onClick={() => handleStartExam(exam)}>Start</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* VIEW 2: INSTRUCTIONS (Added this part) */}
                        {view === 'instructions' && selectedExam && (
                            <div className="content-card instructions-view">
                                <h2>Exam Instructions: {selectedExam.categoryName}</h2>
                                <ul className="instruction-list">
                                    <li>Total Questions: <strong>{selectedExam.noofQuestion}</strong></li>
                                    <li>Exam Duration: <strong>{selectedExam.duration} Minutes</strong></li>
                                    <li>Passing Marks: <strong>{selectedExam.passingMarks}</strong></li>
                                    <li>Do not refresh the page during the exam.</li>
                                </ul>
                                <div className="nav-buttons">
                                    <button className="back-btn" onClick={() => setView('list')}>Cancel</button>
                                    <button className="start-btn" onClick={startQuiz}>I am ready to Start</button>
                                </div>
                            </div>
                        )}

                        {/* VIEW 3: QUIZ */}
                        {view === 'quiz' && (
                            isLoading ? (
                                <div className="loader">Fetching Questions...</div>
                            ) : currentExamQuestions && currentExamQuestions.length > 0 ? (
                                <div className="quiz-container">
                                    <div className="question-box">
                                        <p className="question-text">
                                            <strong>Question {currentIndex + 1}:</strong> {currentExamQuestions[currentIndex].question}
                                        </p>
                                        <div className="options-grid">
                                            {Object.entries(currentExamQuestions[currentIndex].options).map(([key, value]) => (
                                                <button 
                                                    key={key} 
                                                    className={`option-btn ${selectedAnswers[currentExamQuestions[currentIndex]._id] === key ? 'active' : ''}`}
                                                    // 'key' here is now "A", "B", "C", or "D"
                                                    onClick={() => setSelectedAnswers({...selectedAnswers, [currentExamQuestions[currentIndex]._id]: key})}
                                                >
                                                    {value}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="nav-buttons">
                                        <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(currentIndex - 1)}>Back</button>
                                        {currentIndex < currentExamQuestions.length - 1 ? (
                                            <button onClick={() => setCurrentIndex(currentIndex + 1)}>Next</button>
                                        ) : (
                                            <button className="submit-btn" onClick={handleFinalSubmit}>Finish Exam</button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="content-card">
                                    <h3>No Questions Found</h3>
                                    <p>We couldn't find any questions for this exam. Please check if questions are assigned to this category in the Admin Panel.</p>
                                    <button onClick={() => setView('list')}>Back to Exam List</button>
                                </div>
                            )
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default WriteExam;