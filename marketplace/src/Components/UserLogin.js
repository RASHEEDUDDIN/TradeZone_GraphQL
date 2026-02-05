import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './store/authSlice';
import { userService } from '../services/dbService';

const UserLogin = () => {
    const [username, setUsername] = useState('');
    const { userName, userRole } = useSelector((state) => state.auth);

    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [bannedMessage, setBannedMessage] = useState('');
    const [showBannedDialog, setShowBannedDialog] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

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
            const user = await userService.login(username, password);
            
            if (!user) {
                throw new Error('Invalid username or password');
            }

            if (user.status === 'banned') {
                setBannedMessage(`You have been banned by admin ${user.bannedBy}. Please contact admin ${user.bannedBy}`);
                setShowBannedDialog(true);
                return;
            }

            // Update auth state
            dispatch(login({
                username: user.username,
                userRole: user.role
            }));

            // Update localStorage
            localStorage.setItem('username', user.username);
            localStorage.setItem('userRole', user.role);

            setSuccessMessage(`Welcome, ${username}!`);
            navigate('/user/dashboard');
        } catch (error) {
            setSuccessMessage(error.message || 'An error occurred during login. Please try again.');
        }
    };
    // const handleLogin = async () => {
    //     try {
    //         const response = await fetch('https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/users', {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5Yjk2Y2FhNWVjNzQ5NDQxMThiNyIsInVzZXJuYW1lIjoibW9oYW1tZWQuZ0Bub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzI5NjY1OTQ4LCJleHAiOjE3MzE4MjU5NDh9.zt_Nr2QKj06ocTkCO_fpXrtspfjIbDLJI_MTzT9zWgQ`,
    //             },
    //         });

    //         if (response.ok) {
    //             const responseData = await response.json();
    //             const userData = responseData.data.find(user => user.username === username && user.password === password);

    //             if (userData) {

    //                 if (userData.status === 'banned') {
    //                     console.log('banned ', userData);
    //                     setBannedMessage(`You have been banned by admin ${userData.bannedBy}. Please contact admin ${userData.bannedBy}`);
    //                     setShowBannedDialog(true);
    //                 } else {
    //                     console.log('active ', userData);
    //                     setSuccessMessage(`User ${userData.username} logged in successfully!`);

    //                     dispatch(login({ username: userData.username, userRole: 'user' }));
    //                     console.log("Logged in as ", userData.username);


    //                     if (userData.role === 'user') {
    //                         setTimeout(() => {
    //                             navigate('/user/dashboard');
    //                             setSuccessMessage('');
    //                         }, 2000);
    //                     }
    //                 }
    //             } else {
    //                 alert('Invalid username or password');
    //             }
    //         } else {
    //             const errorData = await response.json();
    //             alert(`Login failed: ${errorData.message || 'Unknown error'}`);
    //         }
    //     } catch (error) {
    //         console.error('Error during login:', error);
    //         alert('An error occurred during login. Please try again.');
    //     }
    // };

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
                sx={{ mt: 2 }}
            >
                Login
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
