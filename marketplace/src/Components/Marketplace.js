import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    CardMedia, 
    Button, 
    Dialog, 
    DialogContent, 
    DialogTitle,
    Chip
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from './store/authSlice';
import { fetchItems } from './store/itemSlice';

function Marketplace() {
    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth || {});
    const { userName = '', userRole = '', cart = [] } = authState;
    const [selectedItem, setSelectedItem] = useState(null);
    const dispatch = useDispatch();
    const items = useSelector((state) => state.items?.items || []); // Add fallback to empty array

    // Filter items based on user role and ownership
    const filteredItems = items.filter(item => {
        // Show all items
        return item; // Just return true to show all items
    });

    const showPurchaseButton = (item) => {
        // Only show Add to Cart button if user is logged in as a regular user AND is not the item owner
        if (!item || !item.id) return false; // Use id instead of _id
        if (userName && userRole === 'user') {
            // Check if item is not in cart AND user is not the owner of the item
            return !cart.some(cartItem => cartItem?.id === item.id) && item.userName !== userName;
        }
        return false;
    };

    const getButtonContent = (item) => {
        if (!userName || userRole !== 'user') {
            return null; // Not logged in or not a user
        }
        if (item.userName === userName) {
            return (
                <Typography variant="body2" color="text.secondary" align="center">
                    Your Product
                </Typography>
            );
        }
        if (cart.some(cartItem => cartItem?.id === item.id)) {
            return null; // Item is already in cart
        }
        if (item.status === 'banned') {
            return null; // Item is banned
        }
        return (
            <Button variant="contained" onClick={() => handleAddToCart(item)}>
                Add to Cart
            </Button>
        );
    };

    const handleAddToCart = (item) => {
        dispatch(addToCart(item));
        alert('Item added to cart');
    };

    const handleViewDetails = (item) => {
        setSelectedItem(item);
    };

    useEffect(() => {
        dispatch(fetchItems());
    }, [dispatch]);

    useEffect(() => {
        console.log("Updated Auth State:", { userName, userRole });
        console.log("Selected Item UserName:", selectedItem?.userName);
    }, [userName, userRole, selectedItem]);

    useEffect(() => {
        console.log("Full Redux State:", items);
        console.log("Updated Auth State:", { userName, userRole });
        console.log("Selected Item UserName:", selectedItem?.userName);
    }, [items, userName, userRole, selectedItem]);



    return (
        <Box sx={{ p: 3, bgcolor: 'background.paper', minHeight: '100vh' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{
                mb: 4,
                textAlign: 'center',
                color: 'primary.main',
                fontWeight: 'bold'
            }}>
                Marketplace
            </Typography>
            <Grid container spacing={4}>
                {filteredItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            boxShadow: 3,
                            borderRadius: 2
                        }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={item.itemImage || '/default-image.jpg'}
                                alt={item.itemName}
                                sx={{
                                    objectFit: 'contain',
                                    borderRadius: 2
                                }}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {item.itemName || 'No Name'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ${item.itemPrice || 0}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.itemDescription || 'No description'}
                                </Typography>
                                <Chip
                                    label={`Posted by: ${item.userName || 'Unknown'}`}
                                    size="small"
                                    sx={{
                                        bgcolor: 'grey.100',
                                        color: 'text.secondary',
                                        mb: 2
                                    }}
                                />
                                {item.status === 'banned' && (
                                    <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                                        This item has been banned by admin {item.bannedBy || 'Unknown'}
                                    </Typography>
                                )}
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    ID: {item.id}
                                </Typography>
                            </CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                                {getButtonContent(item)}
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: 6,
                        p: 4
                    }
                }}
            >
                <DialogTitle sx={{ 
                    textAlign: 'center',
                    mb: 3,
                    color: 'primary.main',
                    fontWeight: 'bold'
                }}>
                    {selectedItem?.itemName}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                        <CardMedia
                            component="img"
                            height="400"
                            image={selectedItem?.itemImage}
                            alt={selectedItem?.itemName}
                            sx={{
                                width: '100%',
                                maxWidth: 600,
                                borderRadius: 2,
                                boxShadow: 4,
                                objectFit: 'contain'
                            }}
                        />
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" component="h2" sx={{
                                mb: 2,
                                color: 'primary.main',
                                fontWeight: 'bold'
                            }}>
                                {selectedItem?.itemName}
                            </Typography>
                            <Typography variant="body1" sx={{
                                mb: 2,
                                lineHeight: 1.6,
                                color: 'text.secondary'
                            }}>
                                {selectedItem?.itemDescription}
                            </Typography>
                            <Typography variant="h4" component="div" sx={{
                                mb: 2,
                                color: 'primary.main',
                                fontWeight: 'bold'
                            }}>
                                ${selectedItem?.itemPrice}
                            </Typography>
                            <Chip
                                label={`Posted by: ${selectedItem?.userName}`}
                                size="small"
                                sx={{
                                    bgcolor: 'grey.100',
                                    color: 'text.secondary',
                                    mb: 2
                                }}
                            />
                            {showPurchaseButton(selectedItem) ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={() => handleAddToCart(selectedItem)}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        py: 1.5,
                                        width: '100%'
                                    }}
                                >
                                    <Typography variant="button" sx={{
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem'
                                    }}>
                                        Add to Cart
                                    </Typography>
                                </Button>
                            ) : userName ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        py: 1.5,
                                        width: '100%',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Typography variant="button" sx={{
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem'
                                    }}>
                                        Add to Cart
                                    </Typography>
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        py: 1.5,
                                        width: '100%',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Typography variant="button" sx={{
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem'
                                    }}>
                                        Login to Add to Cart
                                    </Typography>
                                </Button>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default Marketplace;
