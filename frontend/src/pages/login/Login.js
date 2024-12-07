import React, {useState} from "react";
import "./Login.css";
import lockIcon from './lock.png';
import personIcon from './person.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from "../../components/Button";

const Login = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {username, password});

      localStorage.setItem('session_id', response.data.session_id);
      alert(response.data.message);
    } catch(err){
      console.error('Login error:', err);
      alert("An error occurred"); 
    }
  }

  return (
    <div className="login-container">
      <h1 className="title">Log In</h1>
      <div className="login-box">
        <h2 className="welcome-text">Welcome!</h2>
        <p className="subtext">Please enter your login credentials.</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">
              <i className="username-icon"></i>
            </label>
            <img src={personIcon} alt="Username Icon" className="input-icon" />
            <input type="text" id="username" className="username-input" placeholder="Username" value={username} 
            onChange={(e) => setUsername(e.target.value)}/>
          </div>
          <div className="input-group">
            <label htmlFor="password">
              <i className="password-icon"></i>
            </label>
            <img src={lockIcon} alt="Password Icon" className="input-icon" />
            <input type="password" id="password" className="password-input" placeholder="Password" value={password} 
            onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <Button
            type="submit"
            label="Submit"
            onClick={() => navigate('/calculator')}
            variant="primary"
            style={{ fontWeight: 200, fontSize: "30px" }}
          />
        </form>
        <div className="divider">or</div>
        <Button
          label="Create an Account"
          onClick={() => navigate('/register')}
          variant="accent"
          style={{ fontWeight: 200, fontSize: "30px" }}
        />
      </div>
    </div>
  );
};

export default Login;
