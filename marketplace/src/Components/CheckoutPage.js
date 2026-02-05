import React, { useState } from 'react';
import { Typography, TextField, Button, Container, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from './store/authSlice';
import { createTransaction } from './store/transactionSlice';

const CheckoutPage = () => {
    const { userName, cart = [] } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        paymentMethod: '',
    });

    // Validate cart items
    const validateCart = () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before checkout.');
            return false;
        }
        if (!cart.every(item => item.itemName && item.itemPrice)) {
            alert('Some items in your cart are invalid. Please check your cart.');
            return false;
        }
        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCheckout = () => {
        if (!validateCart()) return;

        if (formData.name && formData.address && formData.phone && formData.paymentMethod) {
            const transactionData = {
                userId: userName,
                userName,
                name: formData.name,
                address: formData.address,
                phone: formData.phone,
                paymentMethod: formData.paymentMethod,
                transactionDate: new Date().toISOString(),
                items: cart.map(item => ({
                    itemName: item.itemName,
                    price: item.itemPrice,
                    quantity: item.quantity || 1,
                }))
            };

            dispatch(createTransaction(transactionData))
                .unwrap()
                .then(() => {
                    alert('Transaction successful!');
                    dispatch(clearCart());
                    navigate('/order-confirmation');
                })
                .catch((error) => {
                    console.error('Transaction error:', error);
                    alert(`Transaction failed: ${error.message || 'An error occurred during checkout'}`);
                });
        } else {
            alert('Please fill in all required fields.');
        }
    };

    return (

        <Container>
            <Typography variant="h4" align="center" gutterBottom>Checkout</Typography>
            <TextField label="Name" name="name" value={formData.name} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Address" name="address" value={formData.address} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} fullWidth margin="normal" />
            <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                <FormLabel component="legend">Payment Method</FormLabel>
                <RadioGroup name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
                    <FormControlLabel value="credit_card" control={<Radio />} label="Credit Card" />
                    <FormControlLabel value="bank_transfer" control={<Radio />} label="Bank Transfer" />
                    <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                </RadioGroup>
            </FormControl>
            <Button variant="contained" color="primary" fullWidth onClick={handleCheckout} style={{ marginTop: '20px' }}>Place Order</Button>
            <Button variant="outlined" color="secondary" fullWidth onClick={() => navigate('/cart')} style={{ marginTop: '10px' }}>Back to Cart</Button>
        </Container>
    );
};

export default CheckoutPage;
