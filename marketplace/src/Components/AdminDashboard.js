import React, { useEffect } from 'react';
import { Button, Card, CardContent, Typography, Container, Grid, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_ITEMS, GET_USERS, GET_TRANSACTIONS } from '../graphql/queries';
import { BAN_ITEM, UNBAN_ITEM, BAN_USER, UNBAN_USER, DELETE_USER, DELETE_ITEM } from '../graphql/mutations';

const AdminDashboard = () => {
    const authRole = localStorage.getItem('userRole');
    const adminName = localStorage.getItem('username');
    const navigate = useNavigate();

    // Redirect if not admin
    useEffect(() => {
        if (authRole !== 'admin') {
            navigate('/guestdashboard', { replace: true });
        }
    }, [authRole, navigate]);

    // GraphQL Queries - Always fetch fresh data
    const { loading: loadingItems, data: itemsData, refetch: refetchItems } = useQuery(GET_ALL_ITEMS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    
    const { loading: loadingUsers, data: usersData, refetch: refetchUsers } = useQuery(GET_USERS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    
    const { loading: loadingTransactions, data: transactionsData } = useQuery(GET_TRANSACTIONS, {
        fetchPolicy: 'cache-and-network'
    });

    // GraphQL Mutations - Simple refetchQueries approach
    const [banItem] = useMutation(BAN_ITEM);
    const [unbanItem] = useMutation(UNBAN_ITEM);
    const [deleteItemMutation] = useMutation(DELETE_ITEM);
    const [banUser] = useMutation(BAN_USER);
    const [unbanUser] = useMutation(UNBAN_USER);
    const [deleteUserMutation] = useMutation(DELETE_USER);

    const listings = itemsData?.allItems || [];
    const users = usersData?.users || [];
    const transactions = transactionsData?.transactions || [];

    // Check if item is banned
    const isItemBanned = (item) => {
        return item.status === 'banned';
    };

    // Check if user is banned
    const isUserBanned = (user) => {
        return user.status === 'banned';
    };

    const toggleItemBan = async (itemId, isBanned) => {
        const action = isBanned ? 'unban' : 'ban';
        const confirmAction = window.confirm(`Are you sure you want to ${action} this item?`);

        if (confirmAction) {
            try {
                if (isBanned) {
                    await unbanItem({ variables: { id: itemId } });
                } else {
                    await banItem({ variables: { id: itemId, bannedBy: adminName } });
                }
                
                // Force refetch
                await refetchItems();
                alert(`Item ${action}ned successfully!`);
            } catch (error) {
                console.error('Error toggling item ban:', error);
                alert(`Failed to ${action} item: ${error.message}`);
            }
        }
    };

    const deleteItem = async (itemId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this listing? This action cannot be undone.');

        if (confirmDelete) {
            try {
                await deleteItemMutation({ variables: { id: itemId } });
                await refetchItems();
                alert('Listing deleted successfully!');
            } catch (error) {
                console.error('Error deleting item:', error);
                alert(`Failed to delete listing: ${error.message}`);
            }
        }
    };

    const toggleUserBan = async (userId, isBanned) => {
        const action = isBanned ? 'unban' : 'ban';
        const confirmAction = window.confirm(`Are you sure you want to ${action} this user?`);

        if (!confirmAction) return;

        try {
            console.log(`=== ${action.toUpperCase()} USER ===`);
            console.log('User ID:', userId);
            console.log('Current status: ', isBanned ? 'banned' : 'active');
            
            let result;
            if (isBanned) {
                result = await unbanUser({ 
                    variables: { id: userId }
                });
                console.log('Unban mutation result:', result);
            } else {
                result = await banUser({ 
                    variables: { id: userId, bannedBy: adminName }
                });
                console.log('Ban mutation result:', result);
            }
            
            // Wait a moment for backend to update
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Force refetch with no-cache to get fresh data
            console.log('Refetching users...');
            const { data } = await refetchUsers();
            console.log('Refetched users data:', data);
            
            // Find the updated user
            const updatedUser = data?.users?.find(u => u.id === userId);
            console.log('Updated user:', updatedUser);
            
            alert(`User ${action}ned successfully!`);
        } catch (error) {
            console.error(`Error ${action}ning user:`, error);
            alert(`Failed to ${action} user: ${error.message}`);
        }
    };

    const deleteUser = async (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');

        if (confirmDelete) {
            try {
                await deleteUserMutation({ variables: { id: userId } });
                await refetchUsers();
                alert('User deleted successfully!');
            } catch (error) {
                console.error('Error deleting user:', error);
                alert(`Failed to delete user: ${error.message}`);
            }
        }
    };

    // Loading state
    if (loadingItems || loadingUsers || loadingTransactions) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom sx={{ mt: 3 }}>
                Admin Dashboard
            </Typography>
            <Typography align="center" paragraph>
                Welcome {adminName} <br /> Manage users, listings, and site content.
            </Typography>

            {/* Stats Summary */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                        <CardContent>
                            <Typography variant="h6">Total Listings</Typography>
                            <Typography variant="h3">{listings.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                        <CardContent>
                            <Typography variant="h6">Total Users</Typography>
                            <Typography variant="h3">{users.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
                        <CardContent>
                            <Typography variant="h6">Total Transactions</Typography>
                            <Typography variant="h3">{transactions.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Listings Section */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Listings ({listings.length})
            </Typography>
            <Grid container spacing={3}>
                {listings.map((listing) => (
                    <Grid item xs={12} sm={6} md={4} key={listing.id}>
                        <Card sx={{ 
                            border: isItemBanned(listing) ? '2px solid red' : 'none'
                        }}>
                            <CardContent>
                                <Typography variant="h6">{listing.name || 'N/A'}</Typography>
                                <Typography>Description: {listing.description || 'N/A'}</Typography>
                                <Typography>Price: ${listing.price || 0}</Typography>
                                <Typography>
                                    Status: 
                                    <span style={{ 
                                        color: isItemBanned(listing) ? 'red' : 'green',
                                        fontWeight: 'bold',
                                        marginLeft: '5px'
                                    }}>
                                        {isItemBanned(listing) ? 'banned' : 'active'}
                                    </span>
                                </Typography>
                                <Typography>Created By: {listing.userName || 'N/A'}</Typography>
                                {isItemBanned(listing) && (
                                    <Typography color="error">
                                        Banned by: {listing.bannedBy || 'N/A'}
                                    </Typography>
                                )}
                                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {isItemBanned(listing) ? (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            onClick={() => toggleItemBan(listing.id, true)}
                                        >
                                            Unban Item
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => toggleItemBan(listing.id, false)}
                                        >
                                            Ban Item
                                        </Button>
                                    )}
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => deleteItem(listing.id)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Users Section */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Users ({users.length})
            </Typography>
            <Grid container spacing={3}>
                {users.map((user) => {
                    const userBanned = isUserBanned(user);
                    console.log(`Rendering user ${user.username}: status=${user.status}, isBanned=${userBanned}`);
                    
                    return (
                        <Grid item xs={12} sm={6} md={4} key={user.id}>
                            <Card sx={{ 
                                border: userBanned ? '2px solid red' : 'none'
                            }}>
                                <CardContent>
                                    <Typography variant="h6">{user.username || 'N/A'}</Typography>
                                    <Typography>Email: {user.email || 'N/A'}</Typography>
                                    <Typography>
                                        Status: 
                                        <span style={{ 
                                            color: userBanned ? 'red' : 'green',
                                            fontWeight: 'bold',
                                            marginLeft: '5px'
                                        }}>
                                            {user.status || 'active'}
                                        </span>
                                    </Typography>
                                    <Typography>Role: {user.role || 'N/A'}</Typography>
                                    <Typography>Contact: {user.contactDetails || 'N/A'}</Typography>
                                    {userBanned && user.bannedBy && (
                                        <Typography color="error">
                                            Banned by: {user.bannedBy}
                                        </Typography>
                                    )}
                                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {userBanned ? (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                onClick={() => toggleUserBan(user.id, true)}
                                            >
                                                Unban
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={() => toggleUserBan(user.id, false)}
                                            >
                                                Ban
                                            </Button>
                                        )}
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => deleteUser(user.id)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Transactions Section */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Transactions ({transactions.length})
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {transactions.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography color="text.secondary">No transactions yet.</Typography>
                    </Grid>
                ) : (
                    transactions.map((transaction) => (
                        <Grid item xs={12} sm={6} md={4} key={transaction.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Order: {transaction.orderId}</Typography>
                                    <Typography>Amount: ${transaction.totalAmount}</Typography>
                                    <Typography>Status: {transaction.status}</Typography>
                                    <Typography>
                                        Date: {new Date(parseInt(transaction.createdAt)).toLocaleDateString()}
                                    </Typography>
                                    <Typography>Items: {transaction.items?.length || 0}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
};

export default AdminDashboard;