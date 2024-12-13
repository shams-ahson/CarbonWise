
import React, {useState} from "react";
import "./Login.css";
import lockIcon from './lock.png';
import personIcon from './person.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from "../../components/Button";
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
        setError('Please fill out all fields!');
        return;
    }

    setError('');

    try {
        const response = await axios.post('http://localhost:5001/api/auth/login', { username, password });

        const token = response.data.session_id;
        localStorage.setItem('authToken', token);

     
        Swal.fire({
            icon: 'success',
            title: 'Logged in Successfully 🌍',
            text: `Welcome back ${username}! 👣 `,
            confirmButtonColor: '#4caf50',
        });

        navigate('/calculator');
    } catch (err) {
        if (err.response) {
            const { status, data } = err.response;

            if (status === 404) {
                setError(data.error || 'User does not exist, please register.');
            } else if (status === 401) {
                setError(data.message || 'Incorrect password.');
            } else {
                setError('An error occurred. Please try again.');
            }
        } else {
            console.error('Login error:', err);
            setError('Unable to connect to the server. Please try again later.');
        }

  
        Swal.fire({
            icon: 'error',
            title: 'Login failed',
            text: 'Please check your credentials and try again.',
            confirmButtonColor: '#d33',
        });
    }
};


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
          {error && <p className="error-message">{error}</p>}
          <Button
            type="submit"
            label="Submit"
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