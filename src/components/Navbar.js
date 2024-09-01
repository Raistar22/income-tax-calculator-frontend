import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, googleProvider, githubProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { Button, Typography, Box, Menu, MenuItem } from '@mui/material';
import './Navbar.css'; // Import the CSS file for styling

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleLogin = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Typography variant="h5" component="div" className="navbar-title">
          Income Tax Calculator
        </Typography>
      </Link>

      <Box className="nav-container">
        <div className="nav-links">
          <Button
            component={Link}
            to="/tax-plan-form"
            variant="contained"
            color="primary"
            className="nav-button"
          >
            Tax Plan Form
          </Button>
          <Button
            component={Link}
            to="/compare-tax-plans"
            variant="contained"
            color="secondary"
            className="nav-button"
          >
            Compare Tax Plans
          </Button>
        </div>

        <div className="auth-buttons">
          {user ? (
            <>
              <Button variant="outlined" color="error" onClick={handleLogout}>
                Logout
              </Button>
              <Typography variant="body1" className="user-info">
                Welcome, {user.displayName}
              </Typography>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleMenuOpen}
                className="login-button"
              >
                Login
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                className="menu"
              >
                <MenuItem onClick={() => { handleLogin(googleProvider); handleMenuClose(); }}>
                  Login with Google
                </MenuItem>
                <MenuItem onClick={() => { handleLogin(githubProvider); handleMenuClose(); }}>
                  Login with GitHub
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      </Box>
    </nav>
  );
};

export default Navbar;
