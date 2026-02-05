import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions } from './store/transactionSlice';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

const UserTransactions = () => {
    const dispatch = useDispatch();
    const transactions = useSelector((state) => state.transactions.transactions);
    const status = useSelector((state) => state.transactions.status);
    const error = useSelector((state) => state.transactions.error);
    const { userName } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Your Transactions
            </Typography>
            {status === 'loading' ? (
                <Typography>Loading transactions...</Typography>
            ) : (
                <>
                    {status === 'failed' ? (
                        <Typography color="error" gutterBottom>
                            Failed to load transactions. Please try again later.
                        </Typography>
                    ) : (
                        <>
                            {transactions && transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <Paper key={transaction.id} sx={{ mb: 2, p: 2 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Transaction ID: {transaction.id}
                                        </Typography>
                                        <List>
                                            <ListItem>
                                                <ListItemText
                                                    primary="Date"
                                                    secondary={new Date(transaction.transactionDate).toLocaleString()}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText
                                                    primary="Status"
                                                    secondary="Completed"
                                                    sx={{ color: 'success.main' }}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText
                                                    primary="Total Amount"
                                                    secondary={`$${transaction.items.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2)}`}
                                                />
                                            </ListItem>
                                            <Divider />
                                            <Typography variant="subtitle1" gutterBottom>
                                                Items:
                                            </Typography>
                                            {transaction.items.map((item, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText
                                                        primary={item.itemName}
                                                        secondary={`$${item.price} x ${item.quantity || 1}`}
                                                    />
                                                </ListItem>
                                            ))}
                                            <Divider />
                                            <ListItem>
                                                <ListItemText
                                                    primary="Buyer"
                                                    secondary={transaction.name}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText
                                                    primary="Address"
                                                    secondary={transaction.address}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText
                                                    primary="Phone"
                                                    secondary={transaction.phone}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText
                                                    primary="Payment Method"
                                                    secondary={transaction.paymentMethod}
                                                />
                                            </ListItem>
                                        </List>
                                    </Paper>
                                ))
                            ) : (
                                <Typography>No transactions found.</Typography>
                            )}
                        </>
                    )}
                </>
            )}
        </Box>
    );
};

export default UserTransactions;
// //             {error && <p style={{ color: 'red' }}>{error}</p>}
// //             {transactions && transactions.length > 0 ? (
// //                 transactions.map((transaction) => (
// //                     <div key={transaction._id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
// //                         <p><strong>Transaction ID:</strong> {transaction._id || 'N/A'}</p>
// //                         <p><strong>Amount:</strong> ${transaction.amount || 'N/A'}</p>
// //                         <p><strong>Date:</strong> {transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleString() : 'N/A'}</p>
// //                         <p><strong>Items:</strong></p>
// //                         {transaction.items && transaction.items.length > 0 ? (
// //                             <ul>
// //                                 {transaction.items.map((item, index) => (
// //                                     <li key={index}>
// //                                         <p><strong>Item Name:</strong> {item.itemName || 'N/A'}</p>
// //                                         <p><strong>Price:</strong> ${item.price || 'N/A'}</p>
// //                                         <p><strong>Quantity:</strong> {item.quantity || 'N/A'}</p>
// //                                     </li>
// //                                 ))}
// //                             </ul>
// //                         ) : (
// //                             <p>No items found for this transaction.</p>
// //                         )}
// //                         <p><strong>Buyer:</strong> {transaction.name || 'N/A'}</p>
// //                         <p><strong>Address:</strong> {transaction.address || 'N/A'}</p>
// //                         <p><strong>Phone:</strong> {transaction.phone || 'N/A'}</p>
// //                         <p><strong>Payment Method:</strong> {transaction.paymentMethod || 'N/A'}</p>
// //                     </div>
// //                 ))
// //             ) : (
// //                 <p>No transactions found.</p>
// //             )}
// //         </div>
// //     );
// // };

// // export default UserTransactions;


// // import React, { useEffect } from 'react';
// // import { useSelector, useDispatch } from 'react-redux';
// // import { fetchTransactions } from './store/transactionSlice';

// // const UserTransactions = () => {
// //     const dispatch = useDispatch();
// //     const transactions = useSelector((state) => state.transactions.transactions);
// //     const status = useSelector((state) => state.transactions.status);
// //     const error = useSelector((state) => state.transactions.error);
// //     const { userName } = useSelector((state) => state.auth);

// //     useEffect(() => {
// //         dispatch(fetchTransactions());
// //     }, [dispatch]);

// //     return (
// //         <div>
// //             <h2>Your Transactions</h2>
// //             {error && <p style={{ color: 'red' }}>{error}</p>}
// //             {transactions && transactions.length > 0 ? (
// //                 transactions.map((transaction) => (
// //                     <div key={transaction._id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
// //                         <p><strong>Transaction ID:</strong> {transaction._id || 'N/A'}</p>
// //                         <p><strong>Amount:</strong> ${transaction.amount || 'N/A'}</p>
// //                         <p><strong>Date:</strong> {transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleString() : 'N/A'}</p>
// //                         <p><strong>Items:</strong></p>
// //                         {transaction.items && transaction.items.length > 0 ? (
// //                             <ul>
// //                                 {transaction.items.map((item, index) => (
// //                                     <li key={index}>
// //                                         <p><strong>Item Name:</strong> {item.itemName || 'N/A'}</p>
// //                                         <p><strong>Price:</strong> ${item.price || 'N/A'}</p>
// //                                         <p><strong>Quantity:</strong> {item.quantity || 'N/A'}</p>
// //                                     </li>
// //                                 ))}
// //                             </ul>
// //                         ) : (
// //                             <p style={{ color: 'gray' }}>No items found for this transaction.</p>
// //                         )}
// //                         <p><strong>Buyer:</strong> {transaction.name || 'N/A'}</p>
// //                         <p><strong>Address:</strong> {transaction.address || 'N/A'}</p>
// //                         <p><strong>Phone:</strong> {transaction.phone || 'N/A'}</p>
// //                         <p><strong>Payment Method:</strong> {transaction.paymentMethod || 'N/A'}</p>
// //                     </div>
// //                 ))
// //             ) : (
// //                 <p>No transactions found.</p>
// //             )}
// //         </div>
// //     );
// // };

// // export default UserTransactions;


// // import React, { useEffect } from 'react';
// // import { useSelector, useDispatch } from 'react-redux';
// // import { fetchTransactions } from './store/transactionSlice';
// // import { Box, Typography, Paper, Divider, List, ListItem, ListItemText } from '@mui/material';

// // const UserTransactions = () => {
// //     const dispatch = useDispatch();
// //     const transactions = useSelector((state) => state.transactions.transactions);
// //     const status = useSelector((state) => state.transactions.status);
// //     const error = useSelector((state) => state.transactions.error);
// //     const { userName } = useSelector((state) => state.auth);

// //     useEffect(() => {
// //         dispatch(fetchTransactions());
// //     }, [dispatch]);

// //     return (
// //         <Box p={4}>
// //             <Typography variant="h4" align="center" gutterBottom>
// //                 Your Transactions
// //             </Typography>
// //             {error && <Typography color="error">{error}</Typography>}
// //             {transactions && transactions.length > 0 ? (
// //                 transactions.map((transaction) => (
// //                     <Paper key={transaction._id} elevation={3} style={{ marginBottom: '20px', padding: '20px' }}>
// //                         <Typography variant="h6" gutterBottom>Transaction ID: {transaction._id || 'N/A'}</Typography>
// //                         <Divider style={{ marginBottom: '15px' }} />

// //                         <List>
// //                             <ListItem>
// //                                 <ListItemText primary="Amount" secondary={`$${transaction.items.price || 'N/A'}`} />
// //                             </ListItem>
// //                             <ListItem>
// //                                 <ListItemText primary="Date" secondary={transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleString() : 'N/A'} />
// //                             </ListItem>
// //                             <ListItem>
// //                                 <ListItemText primary="Buyer" secondary={transaction.name || 'N/A'} />
// //                             </ListItem>
// //                             <ListItem>
// //                                 <ListItemText primary="Address" secondary={transaction.address || 'N/A'} />
// //                             </ListItem>
// //                             <ListItem>
// //                                 <ListItemText primary="Phone" secondary={transaction.phone || 'N/A'} />
// //                             </ListItem>
// //                             <ListItem>
// //                                 <ListItemText primary="Payment Method" secondary={transaction.paymentMethod || 'N/A'} />
// //                             </ListItem>
// //                         </List>

// //                         <Typography variant="subtitle1" gutterBottom style={{ marginTop: '15px' }}>Items:</Typography>
// //                         {transaction.items && transaction.items.length > 0 ? (
// //                             transaction.items.map((item, index) => (
// //                                 <Box key={index} p={2} bgcolor="#f9f9f9" mb={1} borderRadius={2}>
// //                                     <Typography variant="body1"><strong>Item Name:</strong> {item.itemName || 'N/A'}</Typography>
// //                                     <Typography variant="body2"><strong>Price:</strong> ${item.price || 'N/A'}</Typography>
// //                                     <Typography variant="body2"><strong>Quantity:</strong> {item.quantity || 'N/A'}</Typography>
// //                                 </Box>
// //                             ))
// //                         ) : (
// //                             <Typography color="textSecondary" style={{ marginTop: '10px' }}>No items found for this transaction.</Typography>
// //                         )}
// //                     </Paper>
// //                 ))
// //             ) : (
// //                 <Typography align="center" color="textSecondary">No transactions found.</Typography>
// //             )}
// //         </Box>
// //     );
// // };

// // export default UserTransactions;


// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchTransactions } from './store/transactionSlice';
// import { Box, Typography, Paper, Divider, List, ListItem, ListItemText } from '@mui/material';

// const UserTransactions = () => {
//     const dispatch = useDispatch();
//     const transactions = useSelector((state) => state.transactions.transactions);
//     const status = useSelector((state) => state.transactions.status);
//     const error = useSelector((state) => state.transactions.error);
//     const userName = useSelector((state) => state.auth);
//     const [userTransactions, setUserTransactions] = useState([]);

//     useEffect(() => {
//         dispatch(fetchTransactions());
//     }, [dispatch]);

//     useEffect(() => {
//         const filteredTransactions = transactions.filter(
//             (transaction) => transaction.userName?.toLowerCase() === userName?.toLowerCase()
//         );
//         setUserTransactions(filteredTransactions);
//     }, [transactions, userName]);

//     const calculateAmount = (items) => {
//         return items.reduce((total, item) => total + parseFloat(item.price || 0), 0).toFixed(2);
//     };

//     console.log("Logged-in userName:", userName);
//     console.log("Filtered transactions:", userTransactions);

//     return (
//         <Box p={4}>
//             <Typography variant="h4" align="center" gutterBottom>
//                 Your Transactions
//             </Typography>
//             {error && <Typography color="error" align="center">{error}</Typography>}
//             {transactions && transactions.length > 0 ? (
//                 transactions.map((transaction) => (
//                     <Paper key={transaction._id} elevation={3} style={{ marginBottom: '20px', padding: '20px' }}>
//                         <Typography variant="h6" gutterBottom>Transaction ID: {transaction._id || 'N/A'}</Typography>
//                         <Divider style={{ marginBottom: '15px' }} />

//                         <List>
//                             <ListItem>
//                                 <ListItemText primary="Amount" secondary={`$${calculateAmount(transaction.items) || 'N/A'}`} />
//                             </ListItem>
//                             <ListItem>
//                                 <ListItemText primary="Date" secondary={transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleString() : 'N/A'} />
//                             </ListItem>
//                             <ListItem>
//                                 <ListItemText primary="Buyer" secondary={transaction.name || 'N/A'} />
//                             </ListItem>
//                             <ListItem>
//                                 <ListItemText primary="Address" secondary={transaction.address || 'N/A'} />
//                             </ListItem>
//                             <ListItem>
//                                 <ListItemText primary="Phone" secondary={transaction.phone || 'N/A'} />
//                             </ListItem>
//                             <ListItem>
//                                 <ListItemText primary="Payment Method" secondary={transaction.paymentMethod || 'N/A'} />
//                             </ListItem>
//                         </List>

//                         <Typography variant="subtitle1" style={{ marginTop: '15px' }}>Items:</Typography>
//                         {transaction.items && transaction.items.length > 0 ? (
//                             transaction.items.map((item, index) => (
//                                 <Box key={index} p={2} bgcolor="#f5f5f5" mb={1} borderRadius={2}>
//                                     <Typography variant="body1"><strong>Item Name:</strong> {item.itemName || 'N/A'}</Typography>
//                                     <Typography variant="body2"><strong>Price:</strong> ${item.price || 'N/A'}</Typography>
//                                     <Typography variant="body2"><strong>Quantity:</strong> {item.quantity || 'N/A'}</Typography>
//                                 </Box>
//                             ))
//                         ) : (
//                             <Typography color="textSecondary" style={{ marginTop: '10px' }}>No items found for this transaction.</Typography>
//                         )}
//                     </Paper>
//                 ))
//             ) : (
//                 <Typography align="center" color="textSecondary">No transactions found.</Typography>
//             )}
//         </Box>
//     );
// };


