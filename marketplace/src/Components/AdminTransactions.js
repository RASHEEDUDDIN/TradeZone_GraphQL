import React from 'react';
import { Box, Typography, Paper, Divider, List, ListItem, ListItemText, CircularProgress, Alert, Chip } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_TRANSACTIONS } from '../graphql/queries';

const AdminTransactions = () => {
    // Fetch all transactions using GraphQL
    const { loading, error, data } = useQuery(GET_TRANSACTIONS, {
        fetchPolicy: 'network-only'
    });

    const transactions = data?.transactions || [];

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

    const calculateAmount = (items) => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    return (
        <Box p={4}>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
                All Transactions
            </Typography>

            {transactions.length > 0 ? (
                transactions.map((transaction) => (
                    <Paper
                        key={transaction.id}
                        elevation={3}
                        sx={{ mb: 3, p: 3 }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Order #{transaction.orderId}
                            </Typography>
                            <Chip
                                label={transaction.status.toUpperCase()}
                                color={transaction.status === 'completed' ? 'success' : 'warning'}
                                size="small"
                            />
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <List>
                            <ListItem>
                                <ListItemText
                                    primary="Customer"
                                    secondary={transaction.user?.username || 'N/A'}
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemText
                                    primary="Total Amount"
                                    secondary={
                                        <Typography component="span" sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'primary.main' }}>
                                            ${calculateAmount(transaction.items)}
                                        </Typography>
                                    }
                                />
                            </ListItem>

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
                        </List>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Items Purchased:
                        </Typography>

                        {transaction.items && transaction.items.length > 0 ? (
                            transaction.items.map((item, index) => (
                                <Box
                                    key={index}
                                    p={2}
                                    bgcolor="#f5f5f5"
                                    mb={1}
                                    borderRadius={2}
                                >
                                    <Typography variant="body1">
                                        <strong>Item:</strong> {item.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Price:</strong> ${item.price.toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Quantity:</strong> {item.quantity}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
                                        <strong>Subtotal:</strong> ${(item.price * item.quantity).toFixed(2)}
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography color="textSecondary" sx={{ mt: 2 }}>
                                No items found for this transaction.
                            </Typography>
                        )}
                    </Paper>
                ))
            ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No transactions found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Transactions will appear here when users make purchases
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default AdminTransactions;