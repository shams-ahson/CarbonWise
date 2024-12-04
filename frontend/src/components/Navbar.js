import React from 'react';
import { AppBar, Toolbar, Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

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
          <StyledButton color="inherit" component={Link} to="/recommendations">
            Recommendations
          </StyledButton>
          <StyledButton color="inherit" component={Link} to="/">
            Logout
          </StyledButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
