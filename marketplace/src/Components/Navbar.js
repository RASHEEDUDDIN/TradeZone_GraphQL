import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Button, Menu, MenuItem, Typography, Badge, Dialog, DialogContent, DialogTitle } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useSelector, useDispatch } from 'react-redux';
import { logout, clearCart } from './store/authSlice';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userName, userRole } = useSelector((state) => state.auth);
    const [openCart, setOpenCart] = useState(false);
    const cart = useSelector((state) => state.auth.cart || []);

    const handleCartClick = () => {
        navigate('/cart');
    };

    const handleCloseCart = () => {
        setOpenCart(false);
    };

    const handleClearCart = () => {
        dispatch(clearCart());
        setOpenCart(false);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCreateAdminRedirect = () => {
        navigate('/admin-register');
        handleMenuClose();
    };

    const handleLogout = () => {
        dispatch(logout());
        handleMenuClose();
        navigate('/');
    };

    const total = (cart || []).reduce((acc, item) => acc + item.price, 0);

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                    Toronto Marketplace
                </Typography>

                <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button color="inherit" onClick={() => {
                        if (userRole === 'admin') {
                            navigate('/admin/dashboard');
                        } else if (userRole === 'user') {
                            navigate('/user/dashboard');
                        } else {
                            navigate('/guestdashboard');
                        }
                    }}>
                        Dashboard
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/marketplace')}>
                        Marketplace
                    </Button>
                </div>

                {userName && (
                    <IconButton color="inherit" onClick={handleCartClick}>
                        <Badge badgeContent={cart.length} color="secondary">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                )}

                <IconButton color="inherit" onClick={handleMenuOpen}>
                    <AccountCircle />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    {userName ? [
                        <MenuItem disabled key="username">{userName}</MenuItem>,
                        userRole === 'user' && (
                            <MenuItem
                                key="transactions"
                                onClick={() => {
                                    navigate('/user/transactions');
                                    handleMenuClose();
                                }}
                            >
                                View Transactions
                            </MenuItem>
                        ),
                        userRole === 'admin' && (
                            <MenuItem
                                key="create-admin"
                                onClick={handleCreateAdminRedirect}
                            >
                                Create New Admin
                            </MenuItem>
                        ),
                        userRole === 'admin' && (
                            <MenuItem
                                key="admin-transactions"
                                onClick={() => {
                                    navigate('/admin/transactions');
                                    handleMenuClose();
                                }}
                            >
                                All Transactions
                            </MenuItem>
                        ),
                        <MenuItem
                            key="logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </MenuItem>
                    ] : [
                        <MenuItem
                            key="admin-login"
                            onClick={() => {
                                navigate('/admin-login');
                                handleMenuClose();
                            }}
                        >
                            Admin Login
                        </MenuItem>,
                        <MenuItem
                            key="user-login"
                            onClick={() => {
                                navigate('/user-login');
                                handleMenuClose();
                            }}
                        >
                            User Login
                        </MenuItem>
                    ]}
                </Menu>
                <Dialog open={openCart} onClose={handleCloseCart}>
                    <DialogTitle>Cart Summary</DialogTitle>
                    <DialogContent>
                        {cart.length > 0 ? (
                            <div>
                                {cart.map((item, index) => (
                                    <Typography key={index}>
                                        {item.itemName} - ${item.price}
                                    </Typography>
                                ))}
                                <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
                            </div>
                        ) : (
                            <Typography>No items in cart</Typography>
                        )}
                    </DialogContent>
                    <Button onClick={handleClearCart} color="primary">Clear Cart</Button>
                    <Button onClick={handleCloseCart} color="primary">Close</Button>
                </Dialog>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
