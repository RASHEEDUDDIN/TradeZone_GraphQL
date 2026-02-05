import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/dbService';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userName: null,
        userRole: null,
        cart: [],
    },
    reducers: {
        login: (state, action) => {
            state.userName = action.payload.username;
            state.userRole = action.payload.userRole;
        },
        logout: (state) => {
            state.userName = null;
            state.userRole = null;
            state.cart = [];
        },
        addToCart: (state, action) => {
            state.cart.push(action.payload);
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        removeItemFromCart: (state, action) => {
            state.cart = state.cart.filter(item => item.id !== action.payload.id);
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        clearCart: (state) => {
            state.cart = [];
            localStorage.removeItem('cart');
        },
    },

});

export const { login, logout, addToCart, removeItemFromCart, clearCart } = authSlice.actions;

// Remove this duplicate slice declaration
export default authSlice.reducer;
