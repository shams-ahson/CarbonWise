import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/home/Home';
import Calculator from './pages/calculator/Calculator';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Admin from './pages/admin/Admin';

const isQuizCompleted = () => localStorage.getItem('quizCompleted') === 'true';

function NavigationWrapper() {
  const location = useLocation();
  const showNavbar = 
    location.pathname === '/calculator' || 
    location.pathname === '/dashboard' || 
    location.pathname === '/admin';

  return <>{showNavbar && <Navbar />}</>;
}

function ProtectedCalculator() {
  return isQuizCompleted() ? <Navigate to="/dashboard" replace /> : <Calculator />;
}

function App() {
  return (
    <Router>
      <NavigationWrapper />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<ProtectedCalculator />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;