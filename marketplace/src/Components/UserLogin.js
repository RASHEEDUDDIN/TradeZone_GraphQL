import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from './store/authSlice';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../graphql/mutations';

const UserLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [bannedMessage, setBannedMessage] = useState('');
    const [showBannedDialog, setShowBannedDialog] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // GraphQL Login Mutation
    const [loginMutation, { loading }] = useMutation(LOGIN);

    const handleLogin = async () => {
        // Clear previous messages
        setSuccessMessage('');
        setErrorMessage('');

        // Basic validation
        if (!username || !password) {
            setErrorMessage('Please enter both username and password');
            return;
        }

        try {
            const { data } = await loginMutation({
                variables: {
                    username: username.trim(),
                    password: password
                }
            });

            const result = data.login;

            if (!result.success) {
                setErrorMessage(result.message || 'Invalid username or password');
                return;
            }

            // Check if user is banned
            if (result.user.status === 'banned') {
                setBannedMessage('Your account has been banned. Please contact support.');
                setShowBannedDialog(true);
                return;
            }

            // Store token and user info in localStorage
            localStorage.setItem('token', result.token);
            localStorage.setItem('username', result.user.username);
            localStorage.setItem('userRole', result.user.role);
            localStorage.setItem('userId', result.user.id);

            // Update Redux state
            dispatch(login({
                username: result.user.username,
                userRole: result.user.role
            }));

            // Show success message briefly
            setSuccessMessage(`Welcome, ${result.user.username}!`);

            // Navigate immediately based on role
            setTimeout(() => {
                if (result.user.role === 'admin') {
                    navigate('/admin/dashboard', { replace: true });
                } else {
                    navigate('/user/dashboard', { replace: true });
                }
            }, 500);

        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage(error.message || 'An error occurred during login. Please try again.');
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" align="center" gutterBottom sx={{ mt: 4 }}>
                User Login
            </Typography>
            
            {errorMessage && (
                <Typography color="error" align="center" sx={{ mb: 2 }}>
                    {errorMessage}
                </Typography>
            )}

            <TextField
                label="Username"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
            />
            <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogin}
                disabled={loading}
                sx={{ mt: 2 }}
            >
                {loading ? 'Logging in...' : 'Login'}
            </Button>
            <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => navigate('/register')}
                disabled={loading}
                sx={{ mt: 2 }}
            >
                Register as a User
            </Button>

            <Snackbar
                open={Boolean(successMessage)}
                autoHideDuration={3000}
                onClose={() => setSuccessMessage('')}
                message={successMessage}
            />

            <Dialog open={showBannedDialog} onClose={() => setShowBannedDialog(false)}>
                <DialogTitle>Access Restricted</DialogTitle>
                <DialogContent>
                    <Typography>{bannedMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowBannedDialog(false)} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserLogin;