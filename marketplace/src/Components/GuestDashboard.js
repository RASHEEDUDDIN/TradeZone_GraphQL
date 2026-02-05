import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GuestDashboard = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Welcome to Toronto Marketplace</h1>
            <p>Please log in or register to access all features.</p>
        </div>
    );
};

export default GuestDashboard;
