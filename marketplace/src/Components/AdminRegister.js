import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../graphql/mutations';

const AdminRegister = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // GraphQL mutation for registration
    const [registerMutation, { loading }] = useMutation(REGISTER);

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

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateInput()) return;

        try {
            const { data } = await registerMutation({
                variables: {
                    input: {
                        username: username.trim(),
                        email: email.trim(),
                        password: password,
                        contactDetails: '',
                        role: 'admin'  // ✅ Set role as admin
                    }
                }
            });

            const result = data.register;

            if (!result.success) {
                setError(result.message || 'Registration failed');
                return;
            }

            setSuccessMessage(`Admin ${username} registered successfully!`);
            
            // Navigate back to admin dashboard after 2 seconds
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 2000);

        } catch (error) {
            console.error('Error during registration:', error);
            setError(error.message || 'An error occurred during registration. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Create New Admin
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
                Register a new administrator account
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TextField
                label="Username"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
            />

            <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
            />

            <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                helperText="Minimum 6 characters"
            />

            <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
            />

            <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleRegister}
                disabled={loading}
                sx={{ mt: 3 }}
            >
                {loading ? 'Creating Admin...' : 'Create Admin Account'}
            </Button>

            <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => navigate('/admin/dashboard')}
                disabled={loading}
                sx={{ mt: 2 }}
            >
                Back to Dashboard
            </Button>

            <Snackbar
                open={Boolean(successMessage)}
                autoHideDuration={3000}
                onClose={() => setSuccessMessage('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminRegister;