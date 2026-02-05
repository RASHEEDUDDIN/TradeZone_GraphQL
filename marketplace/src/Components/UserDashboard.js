import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { itemService } from '../services/dbService';
import { fetchItems } from './store/itemSlice';

const UserDashboard = () => {

    const items = useSelector((state) => state.items.items);

    const [openAdd, setOpenAdd] = useState(false);
    const [newItem, setNewItem] = useState({ itemName: '', itemDescription: '', itemPrice: '', itemImage: null });
    const [selectedItem, setSelectedItem] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const { userName, userRole } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const userItems = items.filter(item => item.userName === userName);

    useEffect(() => {
        console.log('User Role:', userRole);
        console.log('Is Logged In:', userName);
    }, [userName, userRole]);

    const handleAddItem = async () => {
        try {
            const item = {
                itemName: newItem.itemName,
                itemDescription: newItem.itemDescription,
                itemPrice: parseFloat(newItem.itemPrice),
                itemImage: newItem.itemImage,
                userName,
                itemCreationDate: new Date().toISOString(),
                status: 'active'
            };
            await itemService.create(item);
            setNewItem({ itemName: '', itemDescription: '', itemPrice: '', itemImage: null });
            setOpenAdd(false);
            dispatch(fetchItems());
        } catch (error) {
            console.error('Error creating item:', error);
            alert('Error creating item. Please try again.');
        }
    };

    const handleEditItem = async () => {
        try {
            if (!selectedItem) return;
            const updatedItem = {
                ...selectedItem,
                itemName: newItem.itemName || selectedItem.itemName,
                itemDescription: newItem.itemDescription || selectedItem.itemDescription,
                itemPrice: parseFloat(newItem.itemPrice) || selectedItem.itemPrice,
                itemImage: newItem.itemImage || selectedItem.itemImage
            };
            await itemService.update(selectedItem.id, updatedItem);
            setSelectedItem(null);
            setOpenEdit(false);
            dispatch(fetchItems());
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Error updating item. Please try again.');
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await itemService.delete(itemId);
            dispatch(fetchItems());
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item. Please try again.');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewItem({ ...newItem, itemImage: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>User Dashboard</Typography>
            
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => setOpenAdd(true)}
                sx={{ mb: 2 }}
            >
                Add New Item
            </Button>

            <Grid container spacing={2}>
                {userItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                         <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={item.itemImage || '/default-image.jpg'}
                                alt={item.itemName}
                                sx={{
                                    objectFit: 'contain',
                                    borderRadius: 1
                                }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {item.itemName}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" paragraph>
                                    {item.itemDescription}
                                </Typography>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    ${item.itemPrice}
                                </Typography>
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
                                    onClick={() => {
                                        setSelectedItem(item);
                                        setOpenEdit(true);
                                    }}
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => handleDeleteItem(item.id)}
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Item Name"
                        value={newItem.itemName}
                        onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        value={newItem.itemDescription}
                        onChange={(e) => setNewItem({ ...newItem, itemDescription: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        value={newItem.itemPrice}
                        onChange={(e) => setNewItem({ ...newItem, itemPrice: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        type="file"
                        onChange={handleImageUpload}
                    />
                    <label htmlFor="raised-button-file">
                        <Button
                            variant="contained"
                            component="span"
                            startIcon={<Add />}
                        >
                            Upload Image
                        </Button>
                    </label>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
                    <Button onClick={handleAddItem} color="primary">Add Item</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Item</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Item Name"
                        value={newItem.itemName}
                        onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        value={newItem.itemDescription}
                        onChange={(e) => setNewItem({ ...newItem, itemDescription: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        value={newItem.itemPrice}
                        onChange={(e) => setNewItem({ ...newItem, itemPrice: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="raised-button-file-edit"
                        type="file"
                        onChange={handleImageUpload}
                    />
                    <label htmlFor="raised-button-file-edit">
                        <Button
                            variant="contained"
                            component="span"
                            startIcon={<Add />}
                        >
                            Upload Image
                        </Button>
                    </label>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
                    <Button onClick={handleEditItem} color="primary">Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserDashboard;
