import React from "react";
import "./Login.css";
import lockIcon from './lock.png';
import personIcon from './person.png';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <h1 className="title">CarbonWise</h1>
      <div className="login-box">
        <h2 className="welcome-text">Welcome!</h2>
        <p className="subtext">Please enter your login credentials.</p>
        <form>
          <div className="input-group">
            <label htmlFor="username">
              <i className="username-icon"></i>
            </label>
            <img src={personIcon} alt="Username Icon" className="input-icon" />
            <input type="text" id="username" className="username-input" placeholder="Username" />
          </div>
          <div className="input-group">
            <label htmlFor="password">
              <i className="password-icon"></i>
            </label>
            <img src={lockIcon} alt="Password Icon" className="input-icon" />
            <input type="password" id="password" className="password-input" placeholder="Password" />
          </div>
          <button type="submit" className="sign-in-btn">Sign In</button>
        </form>
        <div className="divider">or</div>
        <button className="create-account-btn"
         onClick={() => navigate('/register')}
        >Create an Account</button>
      </div>
    </div>
  );
};

export default Login;
