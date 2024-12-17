import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Swal from "sweetalert2";


const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(""); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
  
   
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }
  
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    setError(""); 
  
    try {
      const response = await axios.post("https://carbonwise-p938.onrender.com/api/auth/register", formData);
  
   
      Swal.fire({
        icon: "success",
        title: `Welcome, ${formData.username}!`,
        text: "Your account has been created successfully 🌱",
        confirmButtonColor: "#4caf50",
      }).then(() => {
        navigate("/login"); 
      });
  
    } catch (err) {
      
      if (err.response) {
        setError(err.response.data.error || "An error occurred during registration.");
      } else {
        console.error("Registration error:", err);
        setError("Unable to connect to the server. Please try again later.");
      }
    }
  };

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
          <p className="helper-text">Password must be at least 8 characters long.</p> 
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
        {error && <p className="error-message">{error}</p>}
        <div className="button-container">
          <Button
            type="submit"
            label="Register"
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