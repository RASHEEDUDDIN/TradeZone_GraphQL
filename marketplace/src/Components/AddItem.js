import React, { useState } from 'react';
import { Container, TextField, Button, Typography, MenuItem, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_ITEM } from '../graphql/mutations';
import { GET_ITEMS } from '../graphql/queries';

const AddItem = () => {
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [itemImage, setItemImage] = useState('');
    const [itemCategory, setItemCategory] = useState('General');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    // GraphQL Mutation
    const [createItem, { loading }] = useMutation(CREATE_ITEM, {
        // Refetch items after creating new one
        refetchQueries: [{ query: GET_ITEMS }]
    });

    const categories = [
        'General',
        'Electronics',
        'Clothing',
        'Books',
        'Home & Garden',
        'Sports',
        'Toys',
        'Other'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!itemName.trim()) {
            setError('Item name is required');
            return;
        }
        if (!itemPrice || parseFloat(itemPrice) <= 0) {
            setError('Please enter a valid price');
            return;
        }

        try {
            const { data } = await createItem({
                variables: {
                    input: {
                        name: itemName,
                        description: itemDescription,
                        price: parseFloat(itemPrice),
                        image: itemImage,
                        category: itemCategory
                    }
                }
            });

            if (data.createItem) {
                alert('Item created successfully!');
                navigate('/user/dashboard');
            }
        } catch (err) {
            console.error('Error creating item:', err);
            setError(err.message || 'Failed to create item. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
                Create New Listing
            </Typography>
            
            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <Box component="form" onSubmit={handleSubmit}>
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
                    multiline
                    rows={3}
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                />
                <TextField
                    label="Item Price ($)"
                    variant="outlined"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    inputProps={{ min: 0, step: 0.01 }}
                    required
                />
                <TextField
                    label="Image URL"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={itemImage}
                    onChange={(e) => setItemImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    helperText="Enter a URL for the item image"
                />
                <TextField
                    label="Category"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                >
                    {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </TextField>
                <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit" 
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 3, mb: 2 }}
                >
                    {loading ? 'Creating...' : 'Create Listing'}
                </Button>
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    fullWidth
                    onClick={() => navigate('/user/dashboard')}
                >
                    Cancel
                </Button>
            </Box>
        </Container>
    );
};

export default AddItem;