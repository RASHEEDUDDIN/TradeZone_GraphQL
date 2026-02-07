import React, { useState } from 'react';
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
    Chip,
    CircularProgress
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from './store/authSlice';
import { useQuery } from '@apollo/client';
import { GET_ITEMS } from '../graphql/queries';

function Marketplace() {
    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth || {});
    const { userName = '', userRole = '', cart = [] } = authState;
    const [selectedItem, setSelectedItem] = useState(null);
    const dispatch = useDispatch();

    // GraphQL Query to fetch items
    const { loading, error, data } = useQuery(GET_ITEMS);

    const items = data?.items || [];

    const showPurchaseButton = (item) => {
        if (!item || !item.id) return false;
        if (userName && userRole === 'user') {
            return !cart.some(cartItem => cartItem?.id === item.id) && item.userName !== userName;
        }
        return false;
    };

    const getButtonContent = (item) => {
        if (!userName || userRole !== 'user') {
            return null;
        }
        if (item.userName === userName) {
            return (
                <Typography variant="body2" color="text.secondary" align="center">
                    Your Product
                </Typography>
            );
        }
        if (cart.some(cartItem => cartItem?.id === item.id)) {
            return null;
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

    // Loading state
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error">Error loading items: {error.message}</Typography>
            </Box>
        );
    }

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
            
            {items.length === 0 ? (
                <Typography variant="h6" align="center" color="text.secondary">
                    No items available in the marketplace.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {items.map((item) => (
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
                                    image={item.image || '/default-image.jpg'}
                                    alt={item.name}
                                    sx={{
                                        objectFit: 'contain',
                                        borderRadius: 2
                                    }}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {item.name || 'No Name'}
                                    </Typography>
                                    <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                                        ${item.price || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {item.description || 'No description'}
                                    </Typography>
                                    {item.category && (
                                        <Chip
                                            label={item.category}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                            sx={{ mb: 1, mr: 1 }}
                                        />
                                    )}
                                    <Chip
                                        label={`Posted by: ${item.userName || 'Unknown'}`}
                                        size="small"
                                        sx={{
                                            bgcolor: 'grey.100',
                                            color: 'text.secondary',
                                            mb: 2
                                        }}
                                    />
                                </CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                    {getButtonContent(item)}
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

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
                    {selectedItem?.name}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                        <CardMedia
                            component="img"
                            height="400"
                            image={selectedItem?.image || '/default-image.jpg'}
                            alt={selectedItem?.name}
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
                                {selectedItem?.name}
                            </Typography>
                            <Typography variant="body1" sx={{
                                mb: 2,
                                lineHeight: 1.6,
                                color: 'text.secondary'
                            }}>
                                {selectedItem?.description}
                            </Typography>
                            <Typography variant="h4" component="div" sx={{
                                mb: 2,
                                color: 'primary.main',
                                fontWeight: 'bold'
                            }}>
                                ${selectedItem?.price}
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
                            ) : !userName ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/user-login')}
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
                                        Login to Add to Cart
                                    </Typography>
                                </Button>
                            ) : null}
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default Marketplace;