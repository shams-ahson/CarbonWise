import React from 'react';
import './Register.css';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    };

    const handleRegistration = async (e) => {
        e.preventDefault();

        if (formData.password < 8){
            alert('Password must be at least 8 characters.')
            return;
        }

        if (formData.password !== formData.confirmPassword){
            alert('Passwords do not match!');
            return;
        }

        try{
            const response = await axios.post('http://localhost:5001/api/auth/register', formData);
            alert(response.data.message);
        } catch(err){
            alert("An error occurred during registration!"); 
        }
    }

    return (
        <div className="register-container">
            <h1 className="register-title">Create an Account</h1>
            <form className="register-form" onSubmit={handleRegistration}>
                <div className="inputs">
                    <label htmlFor="username" className="input-label">Username:</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        className="input-field" 
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        required 
                    />
                </div>
                <div className="inputs">
                    <label htmlFor="email" className="input-label">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        className="input-field" 
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required 
                    />
                </div>
                <div className="inputs">
                    <label htmlFor="password" className="input-label">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        className="input-field" 
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required 
                    />
                </div>
                <div className="inputs">
                    <label htmlFor="confirm-password" className="input-label">Confirm Password:</label>
                    <input 
                        type="password" 
                        id="confirm-password" 
                        name="confirmPassword" 
                        className="input-field" 
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required 
                    />
                </div>
                <div className="button-container">
                    <Button
                        type="submit"
                        label="Register"
                        onClick={() => navigate('/calculator')}
                        variant="primary"
                        style={{ fontWeight: 200, fontSize: "30px" }}
                        className="register-btn"
                    />
                </div>
            </form>
        </div>
    );
};

export default Register;
