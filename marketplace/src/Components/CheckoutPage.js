import React, { useState } from 'react';
import { Typography, TextField, Button, Container, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from './store/authSlice';
import { useMutation } from '@apollo/client';
import { CREATE_TRANSACTION } from '../graphql/mutations';

const CheckoutPage = () => {
    const { cart = [] } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        paymentMethod: '',
    });

    // GraphQL mutation for creating transaction
    const [createTransactionMutation, { loading }] = useMutation(CREATE_TRANSACTION);

    // Helper functions to get item fields (handles both field name formats)
    const getItemName = (item) => item.itemName || item.name || 'Unknown Item';
    const getItemPrice = (item) => {
        const price = item.itemPrice || item.price;
        return parseFloat(price) || 0;
    };
    const getItemId = (item) => item.id || item._id;

    // Validate cart items
    const validateCart = () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before checkout.');
            return false;
        }
        
        // Check if all items have valid names and prices
        const invalidItems = cart.filter(item => {
            const name = getItemName(item);
            const price = getItemPrice(item);
            return !name || price <= 0;
        });

        if (invalidItems.length > 0) {
            console.error('Invalid cart items:', invalidItems);
            alert('Some items in your cart are invalid. Please check your cart.');
            return false;
        }
        
        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCheckout = async () => {
        // Validate form and cart
        if (!validateCart()) return;

        if (!formData.name || !formData.address || !formData.phone || !formData.paymentMethod) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            // Prepare transaction items for GraphQL using helper functions
            const items = cart.map(item => ({
                itemId: getItemId(item),
                name: getItemName(item),
                price: getItemPrice(item),
                quantity: item.quantity || 1,
            }));

            // Calculate total amount
            const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            console.log('Creating transaction with items:', items);

            // Call GraphQL mutation
            const { data } = await createTransactionMutation({
                variables: {
                    input: {
                        items: items,
                        totalAmount: totalAmount
                    }
                }
            });

            console.log('Transaction created:', data.createTransaction);

            // Clear cart and navigate
            dispatch(clearCart());
            alert('Transaction successful!');
            navigate('/order-confirmation', { 
                state: { 
                    transaction: data.createTransaction,
                    customerDetails: formData
                }
            });

        } catch (error) {
            console.error('Transaction error:', error);
            alert(`Transaction failed: ${error.message || 'An error occurred during checkout'}`);
        }
    };

    // Calculate total for display using helper function
    const totalAmount = cart.reduce((total, item) => total + getItemPrice(item), 0);

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Checkout
            </Typography>

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Order Summary
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Total Items: {cart.length} | Total Amount: ${totalAmount.toFixed(2)}
            </Typography>

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Delivery Information
            </Typography>

            <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                disabled={loading}
            />

            <TextField
                label="Delivery Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                multiline
                rows={2}
                disabled={loading}
            />

            <TextField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                disabled={loading}
            />

            <FormControl component="fieldset" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                <FormLabel component="legend">Payment Method</FormLabel>
                <RadioGroup
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                >
                    <FormControlLabel
                        value="credit_card"
                        control={<Radio />}
                        label="Credit Card"
                    />
                    <FormControlLabel
                        value="bank_transfer"
                        control={<Radio />}
                        label="Bank Transfer"
                    />
                    <FormControlLabel
                        value="paypal"
                        control={<Radio />}
                        label="PayPal"
                    />
                    <FormControlLabel
                        value="cash_on_delivery"
                        control={<Radio />}
                        label="Cash on Delivery"
                    />
                </RadioGroup>
            </FormControl>

            <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleCheckout}
                disabled={loading}
                sx={{ mt: 3 }}
            >
                {loading ? 'Processing...' : `Place Order - $${totalAmount.toFixed(2)}`}
            </Button>

            <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => navigate('/cart')}
                disabled={loading}
                sx={{ mt: 2 }}
            >
                Back to Cart
            </Button>
        </Container>
    );
};

export default CheckoutPage;