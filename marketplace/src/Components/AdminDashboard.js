
import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Container, Grid, Navigate } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { itemService, userService, transactionService } from '../services/dbService';

const AdminDashboard = () => {
    const authRole = localStorage.getItem('userRole');
    const adminName = localStorage.getItem('username');
    const navigate = useNavigate();

    // Redirect if not admin
    useEffect(() => {
        if (authRole !== 'admin') {
            navigate('/guestdashboard', { replace: true });
            return () => {};
        }
    }, [authRole, navigate]);

    const [listings, setListings] = useState([]);
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);

    // Helper functions
    const cleanUserData = (user) => {
        if (!user) return null;
        return {
            id: user.id,
            username: user.username || 'N/A',
            email: user.email || 'N/A',
            role: user.role || 'N/A',
            status: user.status || 'active',
            contactDetails: user.contactDetails || { phone: 'N/A' },
            listedItems: user.listedItems || []
        };
    };

    const cleanListingData = (listing) => {
        if (!listing) return null;
        return {
            id: listing.id,
            itemName: listing.itemName || 'N/A',
            itemDescription: listing.itemDescription || 'N/A',
            itemPrice: listing.itemPrice || 0,
            status: listing.status || 'active',
            userName: listing.userName || 'N/A',
            bannedBy: listing.bannedBy || 'N/A'
        };
    };

    const cleanTransactionData = (transaction) => {
        if (!transaction) return null;
        return {
            id: transaction.id || transaction._id,
            amount: transaction.amount,
            date: transaction.date,
            buyer: transaction.buyer,
            seller: transaction.seller,
            items: transaction.items || []
        };
    };

    // Fetch functions
    const fetchListings = async () => {
        try {
            const rawListings = await itemService.getAll();
            const cleanedListings = rawListings.map(cleanListingData);
            setListings(cleanedListings.filter(listing => listing !== null));
        } catch (error) {
            console.error('Error fetching listings:', error);
            setListings([]);
        }
    };

    const fetchUsers = async () => {
        try {
            const rawUsers = await userService.getAll();
            const cleanedUsers = rawUsers.map(cleanUserData);
            setUsers(cleanedUsers.filter(user => user !== null));
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
    };

    const fetchTransactions = async () => {
        try {
            const rawTransactions = await transactionService.getAll();
            const cleanedTransactions = rawTransactions.map(cleanTransactionData);
            setTransactions(cleanedTransactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
        }
    };

    const toggleItemBan = async (itemId, newStatus) => {
        const confirmBan = window.confirm(`Are you sure you want to ${newStatus === 'banned' ? 'ban' : 'unban'} this item?`);

        if (confirmBan) {
            try {
                await itemService.update(itemId, {
                    status: newStatus,
                    bannedBy: newStatus === 'banned' ? adminName : null
                });
                console.log(`Item ${newStatus} successfully.`);
                fetchListings();
            } catch (error) {
                console.error('Error toggling item ban:', error);
                alert('Failed to update item status. Please try again.');
            }
        }
    };

    const toggleUserBan = async (userId, newStatus) => {
        const action = newStatus === 'banned' ? 'ban' : 'unban';
        const confirmBan = window.confirm(`Are you sure you want to ${action} this user?`);

        if (confirmBan) {
            try {
                await userService.updateStatus(userId, newStatus, adminName);
                console.log(`User ${newStatus} successfully.`);
                fetchUsers();
            } catch (error) {
                console.error('Error toggling user ban:', error);
            }
        }
    };

    const deleteUser = async (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');

        if (confirmDelete) {
            try {
                await userService.delete(userId);
                console.log('User deleted successfully.');
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user. Please try again.');
            }
        }
    };

    // Fetch data when component mounts
    useEffect(() => {
        fetchListings();
        fetchUsers();
        fetchTransactions();
    }, []);

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>Admin Dashboard</Typography>
            <Typography align="center" paragraph>Welcome {adminName} <br /> Manage users, listings, and site content.</Typography>
            <Button
                variant="outlined"
                color="error"
                onClick={async () => {
                    const confirmClear = window.confirm('Are you sure you want to clear ALL data from the database? This action cannot be undone.');
                    if (confirmClear) {
                        try {
                            await transactionService.clearDatabase();
                            console.log('Database cleared successfully');
                            fetchListings();
                            fetchUsers();
                        } catch (error) {
                            console.error('Error clearing database:', error);
                            alert('Failed to clear database. Please try again.');
                        }
                    }
                }}
                sx={{ mt: 2 }}
            >
                Clear All Data
            </Button>

            <Typography variant="h5" gutterBottom>Listings</Typography>
            <Grid container spacing={3}>
                {Array.isArray(listings) && listings.map((listing) => (
                    <Grid item xs={12} sm={6} md={4} key={listing.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{listing.itemName || 'N/A'}</Typography>
                                <Typography>Description: {listing.itemDescription || 'N/A'}</Typography>
                                <Typography>Price: ${listing.itemPrice || 0}</Typography>
                                <Typography>Status: {listing.status || 'N/A'}</Typography>
                                <Typography>Created By: {listing.userName || 'N/A'}</Typography>
                                {listing.status === 'banned' && (
                                    <Typography color="error">Banned by admin: {listing.bannedBy || 'N/A'}</Typography>
                                )}
                                {listing.status === 'active' && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => toggleItemBan(listing.id, 'banned')}
                                        sx={{ mt: 1 }}
                                    >
                                        Ban Item
                                    </Button>
                                )}
                                {listing.status === 'banned' && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => toggleItemBan(listing.id, 'active')}
                                        sx={{ mt: 1 }}
                                    >
                                        Unban Item
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h5" gutterBottom style={{ marginTop: '30px' }}>Users</Typography>
            <Grid container spacing={3}>
                {Array.isArray(users) && users.map((user) => (
                    <Grid item xs={12} sm={6} md={4} key={user.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{typeof user.username === 'string' ? user.username : 'N/A'}</Typography>
                                <Typography>Email: {typeof user.email === 'string' ? user.email : 'N/A'}</Typography>
                                <Typography>Status: {typeof user.status === 'string' ? user.status : 'N/A'}</Typography>
                                <Typography>Role: {typeof user.role === 'string' ? user.role : 'N/A'}</Typography>
                                <Typography>Contact: {typeof user.contactDetails === 'object' && user.contactDetails.phone ? user.contactDetails.phone : 'N/A'}</Typography>
                                <Typography>Listed Items: {Array.isArray(user.listedItems) ? user.listedItems.length : 0}</Typography>
                                {typeof user.status === 'string' && user.status === 'active' && (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => toggleUserBan(user.id, 'banned')}
                                        sx={{ mr: 1 }}
                                    >
                                        Ban
                                    </Button>
                                )}
                                {typeof user.status === 'string' && user.status === 'banned' && (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => toggleUserBan(user.id, 'active')}
                                        sx={{ mr: 1 }}
                                    >
                                        Unban
                                    </Button>
                                )}
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => deleteUser(user.id)}
                                >
                                    Delete
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default AdminDashboard;
