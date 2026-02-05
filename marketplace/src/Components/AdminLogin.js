import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/dbService';
import { useDispatch } from 'react-redux';
import { login } from './store/authSlice';

const AdminLogin = () => {
    const [input, setInput] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLoginAdmin = async () => {
        try {
            const admin = await adminService.login(input, password);
            if (admin) {
                // Clear any existing user data
                localStorage.removeItem('userId');
                localStorage.removeItem('userRole');
                localStorage.removeItem('username');
                
                // Set admin data in localStorage
                localStorage.setItem('username', input);
                localStorage.setItem('userRole', 'admin');
                
                // Update Redux store
                dispatch(login({
                    username: input,
                    userRole: 'admin'
                }));
                
                // Navigate to admin dashboard
                navigate('/admin/dashboard', { replace: true });
            } else {
                setError('Invalid admin credentials');
            }
        } catch (error) {
            console.error('Error during admin login:', error);
            setError('An error occurred during login. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" align="center" gutterBottom>Admin Login</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <TextField
                label="Username or Email"
                fullWidth
                margin="normal"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLoginAdmin}
                sx={{ mt: 2 }}
            >
                Login as Admin
            </Button>
            <Snackbar
                open={Boolean(successMessage)}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage('')}
                message={successMessage}
            />
        </Container>
    );
};

export default AdminLogin;
