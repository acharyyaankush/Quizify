import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Style.css'
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../../redux/authSlice';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state) => state.auth);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const resultAction = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate('/Home');
      }
    };
    return (
        <>
        <div className="login-container">
           <div className="wrapper">
                <form onSubmit={handleSubmit} >
                    <h2>QUIZ-LOGIN</h2>
                    <div className="input-field">
                    <input value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label>Enter your email</label>
                    </div>
                    <div className="input-field">
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                    <label>Enter your password</label>
                    </div>
                    <div className="forget">
                    <label htmlFor="remember">
                        <input type="checkbox" id="remember" />
                        <p>Remember me</p>
                    </label>
                    <a href="#"style={{color:"#7b03fc"}}>Forgot password?</a>
                    </div>
                    <button type="submit">Login</button>
                    <div className="register">
                    Don't have an account? <Link to="/register" style={{color:"#7b03fc"}}> Register</Link>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
   
  };
export default Login


  