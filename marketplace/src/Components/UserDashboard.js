import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, CircularProgress } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MY_ITEMS } from '../graphql/queries';
import { CREATE_ITEM, UPDATE_ITEM, DELETE_ITEM } from '../graphql/mutations';

const UserDashboard = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newItem, setNewItem] = useState({ name: '', description: '', price: '', image: '' });
    
    const { userName, userRole } = useSelector((state) => state.auth);

    // GraphQL Query - Fetch user's items
    const { loading, error, data, refetch } = useQuery(GET_MY_ITEMS);

    // GraphQL Mutations
    const [createItem, { loading: creating }] = useMutation(CREATE_ITEM, {
        onCompleted: () => {
            refetch();
            setOpenAdd(false);
            setNewItem({ name: '', description: '', price: '', image: '' });
        }
    });

    const [updateItem, { loading: updating }] = useMutation(UPDATE_ITEM, {
        onCompleted: () => {
            refetch();
            setOpenEdit(false);
            setSelectedItem(null);
            setNewItem({ name: '', description: '', price: '', image: '' });
        }
    });

    const [deleteItem, { loading: deleting }] = useMutation(DELETE_ITEM, {
        onCompleted: () => {
            refetch();
        }
    });

    const userItems = data?.myItems || [];

    const handleAddItem = async () => {
        if (!newItem.name || !newItem.price) {
            alert('Please fill in item name and price');
            return;
        }

        try {
            await createItem({
                variables: {
                    input: {
                        name: newItem.name,
                        description: newItem.description,
                        price: parseFloat(newItem.price),
                        image: newItem.image,
                        category: 'General'
                    }
                }
            });
            alert('Item created successfully!');
        } catch (err) {
            console.error('Error creating item:', err);
            alert('Error creating item. Please try again.');
        }
    };

    const handleEditItem = async () => {
        if (!selectedItem) return;

        try {
            await updateItem({
                variables: {
                    id: selectedItem.id,
                    input: {
                        name: newItem.name || selectedItem.name,
                        description: newItem.description || selectedItem.description,
                        price: parseFloat(newItem.price) || selectedItem.price,
                        image: newItem.image || selectedItem.image,
                        category: selectedItem.category || 'General'
                    }
                }
            });
            alert('Item updated successfully!');
        } catch (err) {
            console.error('Error updating item:', err);
            alert('Error updating item. Please try again.');
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            await deleteItem({
                variables: { id: itemId }
            });
            alert('Item deleted successfully!');
        } catch (err) {
            console.error('Error deleting item:', err);
            alert('Error deleting item. Please try again.');
        }
    };

    const openEditDialog = (item) => {
        setSelectedItem(item);
        setNewItem({
            name: item.name,
            description: item.description || '',
            price: item.price.toString(),
            image: item.image || ''
        });
        setOpenEdit(true);
    };

    // Loading state
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Box p={3}>
                <Typography color="error">Error loading items: {error.message}</Typography>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>User Dashboard</Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Welcome, {userName}!
            </Typography>
            
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => {
                    setNewItem({ name: '', description: '', price: '', image: '' });
                    setOpenAdd(true);
                }}
                sx={{ mb: 3 }}
            >
                Add New Item
            </Button>

            {userItems.length === 0 ? (
                <Typography color="text.secondary">
                    You haven't listed any items yet. Click "Add New Item" to get started!
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {userItems.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={item.image || '/default-image.jpg'}
                                    alt={item.name}
                                    sx={{
                                        objectFit: 'contain',
                                        borderRadius: 1
                                    }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" paragraph>
                                        {item.description || 'No description'}
                                    </Typography>
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        ${item.price}
                                    </Typography>
                                    {item.category && (
                                        <Typography variant="body2" color="text.secondary">
                                            Category: {item.category}
                                        </Typography>
                                    )}
                                </CardContent>
                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: 1, 
                                    p: 1, 
                                    bgcolor: 'background.paper',
                                    borderTop: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <IconButton
                                        color="primary"
                                        onClick={() => openEditDialog(item)}
                                        disabled={updating}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteItem(item.id)}
                                        disabled={deleting}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Add Item Dialog */}
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Item Name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        sx={{ mt: 2, mb: 2 }}
                        required
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        sx={{ mb: 2 }}
                        required
                        inputProps={{ min: 0, step: 0.01 }}
                    />
                    <TextField
                        fullWidth
                        label="Image URL"
                        value={newItem.image}
                        onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        helperText="Enter a URL for the item image"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
                    <Button 
                        onClick={handleAddItem} 
                        color="primary" 
                        variant="contained"
                        disabled={creating}
                    >
                        {creating ? 'Adding...' : 'Add Item'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Item Dialog */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Item</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Item Name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        sx={{ mt: 2, mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        sx={{ mb: 2 }}
                        inputProps={{ min: 0, step: 0.01 }}
                    />
                    <TextField
                        fullWidth
                        label="Image URL"
                        value={newItem.image}
                        onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        helperText="Enter a URL for the item image"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
                    <Button 
                        onClick={handleEditItem} 
                        color="primary"
                        variant="contained"
                        disabled={updating}
                    >
                        {updating ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserDashboard;