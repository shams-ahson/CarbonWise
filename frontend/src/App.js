import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/home/Home';
import Calculator from './pages/calculator/Calculator';
import Recommendations from './pages/recommendations/Recommendations';
import Login from './pages/login/Login';

function App() {
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/calculator' element={<Calculator/>}></Route>
          <Route path='/recommendations' element={<Recommendations/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
        </Routes>
      </Router>
  );
}

export default App;