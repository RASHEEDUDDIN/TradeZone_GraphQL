import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Button, List, ListItem, ListItemText, Container, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { removeItemFromCart } from './store/authSlice';

const CartPage = () => {
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // Helper function to get item name (handles both field names)
    const getItemName = (item) => item.itemName || item.name || 'Unknown Item';
    
    // Helper function to get item price (handles both field names)
    const getItemPrice = (item) => {
        const price = item.itemPrice || item.price;
        return parseFloat(price) || 0;
    };

    // Calculate total amount
    const totalAmount = cart.reduce((total, item) => total + getItemPrice(item), 0);

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        navigate('/checkout');
    };

    const handleRemoveItem = (itemId) => {
        dispatch(removeItemFromCart({ id: itemId }));
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
                Shopping Cart
            </Typography>

            {cart.length > 0 ? (
                <>
                    <List>
                        {cart.map((item, index) => (
                            <Box key={index}>
                                <ListItem
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        mb: 1,
                                        bgcolor: 'background.paper'
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6">
                                                {getItemName(item)}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>
                                                Price: ${getItemPrice(item).toFixed(2)}
                                            </Typography>
                                        }
                                    />
                                    <IconButton 
                                        onClick={() => handleRemoveItem(item.id || item._id)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItem>
                            </Box>
                        ))}
                    </List>

                    <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h5" align="right" sx={{ fontWeight: 'bold' }}>
                            Total: ${totalAmount.toFixed(2)}
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        onClick={handleCheckout}
                        sx={{ mt: 3 }}
                    >
                        Proceed to Checkout
                    </Button>
                </>
            ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Your cart is empty
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Add some items from the marketplace to get started
                    </Typography>
                </Box>
            )}

            <Button
                variant="outlined"
                color="secondary"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                onClick={() => navigate('/marketplace')}
            >
                {cart.length > 0 ? 'Continue Shopping' : 'Browse Marketplace'}
            </Button>
        </Container>
    );
};

export default CartPage;