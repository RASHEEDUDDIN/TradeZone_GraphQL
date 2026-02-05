import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/dbService';

const AdminRegister = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateInput = () => {
        setError('');
        if (!username.trim()) {
            setError('Username is required');
            return false;
        }
        if (username.length < 3) {
            setError('Username must be at least 3 characters long');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            setError('Invalid email format');
            return false;
        }
        if (!password.trim()) {
            setError('Password is required');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        if (!validateInput()) return;

        setLoading(true);

        try {
            const admin = {
                username,
                email,
                password,
                role: 'admin',
                registrationTime: new Date().toISOString()
            };

            await adminService.register(admin);
            
            localStorage.setItem('username', username);
            localStorage.setItem('userRole', 'admin');
            setSuccessMessage(`Admin ${username} registered successfully!`);
            setTimeout(() => navigate('/admin/dashboard'), 2000);
        } catch (error) {
            console.error('Error during registration:', error);
            setError(error.message || 'An error occurred during registration. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" align="center" gutterBottom>Admin Registration</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <TextField
                label="Username"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onClick={handleRegister}
                sx={{ mt: 2 }}
                disabled={loading}
            >
                {loading ? 'Registering...' : 'Register Admin'}
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

export default AdminRegister;
