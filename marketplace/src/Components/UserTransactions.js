import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, CircularProgress, Alert } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_MY_TRANSACTIONS } from '../graphql/queries';

const UserTransactions = () => {
    // Fetch user's transactions using GraphQL
    const { loading, error, data } = useQuery(GET_MY_TRANSACTIONS, {
        fetchPolicy: 'network-only'
    });

    const transactions = data?.myTransactions || [];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    Failed to load transactions: {error.message}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Your Transactions
            </Typography>

            {transactions.length > 0 ? (
                transactions.map((transaction) => {
                    const totalAmount = transaction.items.reduce(
                        (sum, item) => sum + (item.price * item.quantity),
                        0
                    );

                    return (
                        <Paper key={transaction.id} sx={{ mb: 3, p: 3 }} elevation={2}>
                            <Typography variant="h6" gutterBottom>
                                Order #{transaction.orderId}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <List>
                                <ListItem>
                                    <ListItemText
                                        primary="Order Date"
                                        secondary={new Date(parseInt(transaction.createdAt)).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemText
                                        primary="Status"
                                        secondary={
                                            <Typography
                                                component="span"
                                                sx={{
                                                    color: transaction.status === 'completed' ? 'success.main' : 'warning.main',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {transaction.status.toUpperCase()}
                                            </Typography>
                                        }
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemText
                                        primary="Total Amount"
                                        secondary={
                                            <Typography component="span" sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'primary.main' }}>
                                                ${totalAmount.toFixed(2)}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                Items Ordered:
                            </Typography>

                            {transaction.items.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        p: 2,
                                        mb: 1,
                                        bgcolor: 'background.default',
                                        borderRadius: 1,
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                                    </Typography>
                                </Box>
                            ))}
                        </Paper>
                    );
                })
            ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No transactions found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Your order history will appear here after you make a purchase
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default UserTransactions;