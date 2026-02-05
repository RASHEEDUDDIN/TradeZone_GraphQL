import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/dbService';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactDetails, setContactDetails] = useState('');

    const [error, setError] = useState('');
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

        if (!contactDetails.trim()) {
            setError('Contact Number is required');
            return false;
        }

        if (contactDetails.length < 10) {
            setError('Contact must be at least 10 digits long');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateInput()) {
            return;
        }

        try {
            // Check if username already exists
            const usernameExists = await userService.checkUsername(username);
            if (usernameExists) {
                setError('Username already exists. Please choose a different username.');
                return;
            }

            const userData = {
                username,
                email,
                password,
                contactDetails,
                role: 'user',
                listedItems: [],
                status: 'active'
            };

            await userService.register(userData);
            
            alert('User registered successfully!');
            navigate('/user-login');
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" align="center" gutterBottom>User Registration</Typography>
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
                fullWidth margin="normal"
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
            <TextField
                label="Contact Number"
                fullWidth margin="normal"
                value={contactDetails}
                onChange={(e) => setContactDetails(e.target.value)}
            />

            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleRegister}
                sx={{ mt: 2 }}
            >
                Register
            </Button>
        </Container>
    );
};

export default Register;
