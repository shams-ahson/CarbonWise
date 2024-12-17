import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import axios from 'axios';

const Navbar = () => {
  const StyledAppBar = styled(AppBar)({
    backgroundColor: '#608A33',
  });

  const StyledButton = styled(Button)({
    margin: '0 10px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#93BA85',
    },
    fontFamily: 'Lilita One, sans-serif',
    fontSize: '20px',
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(localStorage.getItem('quizCompleted') === 'true');

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const response = await axios.get('https://carbon-wise-neon.vercel.app//api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(response.data.role === 'admin');
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();

   
    const handleStorageChange = () => {
      const quizStatus = localStorage.getItem('quizCompleted') === 'true';
      console.log('Storage event triggered. quizCompleted =', quizStatus);
      setQuizCompleted(quizStatus);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <StyledAppBar position="static">
      <Toolbar sx={{ padding: '10px 20px' }}>
        <Typography variant="h4" component="div" sx={{ fontFamily: 'Lilita One, sans-serif' }}>
          CarbonWise
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          {!quizCompleted && (
            <StyledButton color="inherit" component={Link} to="/calculator">
              Calculator
            </StyledButton>
          )}
          <StyledButton color="inherit" component={Link} to="/dashboard">
            Dashboard
          </StyledButton>
          {isAdmin && (
            <StyledButton color="inherit" component={Link} to="/admin">
              Add Resource
            </StyledButton>
          )}
          <StyledButton color="inherit" component={Link} to="/">
            Logout
          </StyledButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
