import React from 'react';
import './Register.css';

const Register = () => {
    return (
        <div className="register-container">
            <h1 className="register-title">Create an Account</h1>
            <form className="register-form">
                <div className="inputs">
                    <label htmlFor="username" className="input-label">Username:</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        className="input-field" 
                        placeholder="Enter your username"
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
                        required 
                    />
                </div>
                <div className="inputs">
                    <label htmlFor="confirm-password" className="input-label">Confirm Password:</label>
                    <input 
                        type="password" 
                        id="confirm-password" 
                        name="confirm-password" 
                        className="input-field" 
                        placeholder="Re-enter your password"
                        required 
                    />
                </div>
                <div className="button-container">
                    <button type="submit" className="register-btn">Register</button>
                </div>
            </form>
        </div>
    );
};

export default Register;
