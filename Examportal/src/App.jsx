import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
// import './App.css'
import Login from './pages/common/Components/Login'
import Register from './pages/common/Components/Register'
import Home from './pages/common/Home/Home'
import Addeditexam from './pages/admin/Exams/Addeditexam'
import Addeditquestion from './pages/admin/Exams/Addeditquestion'
import Updatequestion from './pages/admin/Exams/Updatequestion'
import Exam from './pages/admin/Exams/Exam'
import { useDispatch, useSelector } from 'react-redux'
import { getDashboard } from './redux/authSlice'
import api from './utils/axios';
import WriteExam from './pages/common/Components/WriteExam'
import ShowResult from './pages/common/Components/ShowResult'
function App() {
  

const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getDashboard());
    } 
  }, [token, user, dispatch]);

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route index path="/" element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/Home' element={<Home/>}/>
            <Route path='/subject' element={<Addeditexam/>}/>
            <Route path='/question' element={<Addeditquestion/>}/>
            <Route path='/editquestion/:id' element={<Updatequestion/>}/>
            <Route path='/add-exam' element={<Exam/>}/>
            <Route path='/user-exam' element={<WriteExam/>}/>
            <Route path='/result' element={<ShowResult/>}/>
        </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App
