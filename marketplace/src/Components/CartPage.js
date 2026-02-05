import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Button, List, ListItem, ListItemText, Divider, Container, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { removeItemFromCart } from './store/authSlice';

const CartPage = () => {
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const totalAmount = cart.reduce((total, item) => total + parseFloat(item.itemPrice), 0);

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleRemoveItem = (itemId) => {
        dispatch(removeItemFromCart({ id: itemId }));
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>Shopping Cart</Typography>
            {cart.length > 0 ? (
                <List>
                    {cart.map((item, index) => (
                        <div key={index}>
                            <ListItem>
                                <ListItemText
                                    primary={item.itemName}
                                    secondary={`Price: $${item.itemPrice}`}
                                />
                                <IconButton onClick={() => handleRemoveItem(item.id)}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                    <Typography variant="h6" align="center" style={{ marginTop: '20px' }}>
                        Total: ${totalAmount.toFixed(2)}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleCheckout}
                        style={{ marginTop: '20px' }}
                    >
                        Checkout
                    </Button>
                </List>
            ) : (
                <Typography align="center" color="textSecondary">
                    Your cart is empty.
                </Typography>
            )}
            <Button
                variant="contained"
                color="secondary"
                fullWidth
                style={{ marginTop: '10px' }}
                onClick={() => navigate('/marketplace')}
            >
                Back to Marketplace
            </Button>
        </Container>
    );
};

export default CartPage;
