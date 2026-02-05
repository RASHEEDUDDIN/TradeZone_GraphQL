// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchTransactions } from './store/transactionSlice';

// const AdminTransactions = () => {
//     const dispatch = useDispatch();
//     const { transactions, status, error } = useSelector((state) => state.transactions);

//     useEffect(() => {
//         dispatch(fetchTransactions());
//     }, [dispatch]);

//     return (
//         <div>
//             <h2>All Transactions</h2>
//             {status === 'loading' && <p>Loading transactions...</p>}
//             {error && <p>Error: {error}</p>}
//             {transactions.length > 0 ? (
//                 transactions.map((transaction) => (
//                     <div key={transaction.id}>
//                         <p>Transaction ID: {transaction.id}</p>
//                         <p>User: {transaction.userName}</p>
//                         <p>Amount: ${transaction.amount}</p>
//                         <p>Date: {transaction.transactionDate}</p>
//                         <hr />
//                     </div>
//                 ))
//             ) : (
//                 <p>No transactions found.</p>
//             )}
//         </div>
//     );
// };

// export default AdminTransactions;



import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions } from './store/transactionSlice';
import { Box, Typography, Paper, Divider, List, ListItem, ListItemText } from '@mui/material';

const AdminTransactions = () => {
    const dispatch = useDispatch();
    const transactions = useSelector((state) => state.transactions.transactions);
    const status = useSelector((state) => state.transactions.status);
    const error = useSelector((state) => state.transactions.error);

    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch]);

    const calculateAmount = (items) => {
        return items.reduce((total, item) => total + parseFloat(item.price || 0), 0).toFixed(2);
    };

    return (
        <Box p={4}>
            <Typography variant="h4" align="center" gutterBottom>
                All Transactions
            </Typography>
            {error && <Typography color="error" align="center">{error}</Typography>}
            {transactions && transactions.length > 0 ? (
                transactions.map((transaction) => (
                    <Paper key={transaction.id} elevation={3} style={{ marginBottom: '20px', padding: '20px' }}>
                        <Typography variant="h6" gutterBottom>Transaction ID: {transaction.id || 'N/A'}</Typography>
                        <Divider style={{ marginBottom: '15px' }} />

                        <List>
                            <ListItem>
                                <ListItemText primary="Amount" secondary={`$${calculateAmount(transaction.items) || 'N/A'}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Date" secondary={transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleString() : 'N/A'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Buyer" secondary={transaction.name || 'N/A'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Address" secondary={transaction.address || 'N/A'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Phone" secondary={transaction.phone || 'N/A'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Payment Method" secondary={transaction.paymentMethod || 'N/A'} />
                            </ListItem>
                        </List>

                        <Typography variant="subtitle1" style={{ marginTop: '15px' }}>Items:</Typography>
                        {transaction.items && transaction.items.length > 0 ? (
                            transaction.items.map((item, index) => (
                                <Box key={index} p={2} bgcolor="#f5f5f5" mb={1} borderRadius={2}>
                                    <Typography variant="body1"><strong>Item Name:</strong> {item.itemName || 'N/A'}</Typography>
                                    <Typography variant="body2"><strong>Price:</strong> ${item.price || 'N/A'}</Typography>
                                    <Typography variant="body2"><strong>Quantity:</strong> {item.quantity || 'N/A'}</Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography color="textSecondary" style={{ marginTop: '10px' }}>No items found for this transaction.</Typography>
                        )}
                    </Paper>
                ))
            ) : (
                <Typography align="center" color="textSecondary">No transactions found.</Typography>
            )}
        </Box>
    );
};

export default AdminTransactions;
