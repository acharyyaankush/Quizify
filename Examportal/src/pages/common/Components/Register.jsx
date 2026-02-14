import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './Style.css'
import { registerUser } from '../../../redux/authSlice';


function Register(){

 const [name, setName] = useState("");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [isAdmin, setisAdmin] = useState(false);
 const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser({ name, email, password, isAdmin }));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/Home');
    }
  };
   return(
    <>
    <div className="login-container">
        <div className="wrapper">           
            <form onSubmit={handleSubmit} >
                <h2>QUIZ-REGISTER</h2>
                <div className="input-field">
                <input value={name} onChange={(e) => setName(e.target.value)} />
                <label>Enter your name</label>
                </div>
                <div className="input-field">
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Enter your email</label>
                </div>
                <div className="input-field">
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                <label>Enter your password</label>
                </div>
                <button type="submit">Register</button>
                <div className="register">
                Already a member? <Link to="/" style={{color:"#7b03fc"}}>Login</Link>
                </div>
            </form>
        </div>
    </div>
    </>
   );
}
export default Register