import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddItem = () => {
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [itemImage, setItemImage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');

        const formData = new FormData();
        formData.append('itemName', itemName);
        formData.append('itemDescription', itemDescription);
        formData.append('itemPrice', itemPrice);
        formData.append('itemImage', itemImage);
        formData.append('createdBy', userId);
        formData.append('createdAt', new Date().toISOString());

        try {
            const response = await fetch(`https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/items`, {
                method: 'POST',
                headers: {
                    'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5Yjk2Y2FhNWVjNzQ5NDQxMThiNyIsInVzZXJuYW1lIjoibW9oYW1tZWQuZ0Bub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzI5NjY1OTQ4LCJleHAiOjE3MzE4MjU5NDh9.zt_Nr2QKj06ocTkCO_fpXrtspfjIbDLJI_MTzT9zWgQ`,
                },
                body: formData,
            });

            if (response.ok) {
                alert('Item created successfully!');
                navigate('/user/dashboard');
            } else {
                alert('Failed to create item. Please try again.');
            }
        } catch (error) {
            console.error('Error creating item:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Create New Listing
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Item Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                />
                <TextField
                    label="Item Description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    required
                />
                <TextField
                    label="Item Price"
                    variant="outlined"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setItemImage(e.target.files[0])}
                    required
                />
                <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }}>
                    Submit
                </Button>
            </form>
        </Container>
    );
};

export default AddItem;
