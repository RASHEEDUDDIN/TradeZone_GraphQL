import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './store/authSlice';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../graphql/mutations';

const UserLogin = () => {
    const [username, setUsername] = useState('');
    const { userName, userRole } = useSelector((state) => state.auth);

    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [bannedMessage, setBannedMessage] = useState('');
    const [showBannedDialog, setShowBannedDialog] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // GraphQL Login Mutation
    const [loginMutation, { loading }] = useMutation(LOGIN);

    useEffect(() => {
        console.log('userName:', userName);
        console.log('userRole:', userRole);
        if (userName && userRole === 'user') {
            navigate('/user/dashboard');
        } else if (userName && userRole === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [userName, userRole, navigate]);

    const handleLogin = async () => {
        try {
            const { data } = await loginMutation({
                variables: {
                    username: username,
                    password: password
                }
            });

            const result = data.login;

            if (!result.success) {
                throw new Error(result.message || 'Invalid username or password');
            }

            // Store token in localStorage
            localStorage.setItem('token', result.token);
            localStorage.setItem('username', result.user.username);
            localStorage.setItem('userRole', result.user.role);
            localStorage.setItem('userId', result.user.id);

            // Update Redux state
            dispatch(login({
                username: result.user.username,
                userRole: result.user.role
            }));

            setSuccessMessage(`Welcome, ${result.user.username}!`);
            
            // Navigate based on role
            if (result.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/user/dashboard');
            }
        } catch (error) {
            setSuccessMessage(error.message || 'An error occurred during login. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" align="center" gutterBottom>User Login</Typography>
            <TextField
                label="Username"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                onClick={handleLogin}
                disabled={loading}
                sx={{ mt: 2 }}
            >
                {loading ? 'Logging in...' : 'Login'}
            </Button>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/register')}
                sx={{ mt: 2 }}
            >
                Register as a User
            </Button>
            <Snackbar
                open={Boolean(successMessage)}
                autoHideDuration={6000}
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