import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import axios from 'axios';

const Navbar = () => {
  const StyledAppBar = styled(AppBar)({
    backgroundColor: '#608A33',
  });

  const [isAdmin, setIsAdmin] = useState(false);

  const StyledButton = styled(Button)({
    margin: '0 10px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#93BA85',
    },
    fontFamily: 'Lilita One, sans-serif',
    fontSize: '20px',
  });

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5001/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <StyledAppBar position="static">
      <Toolbar sx={{ padding: '10px 20px' }}>
        <Typography variant="h4" component="div" sx={{ fontFamily: 'Lilita One, sans-serif' }}>
          CarbonWise
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          <StyledButton color="inherit" component={Link} to="/calculator">
            Calculator
          </StyledButton>
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
