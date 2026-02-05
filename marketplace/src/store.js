import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Components/store/authSlice';
import transactionReducer from './Components/store/transactionSlice';
import itemReducer from './Components/store/itemSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        transactions: transactionReducer,
        items: itemReducer,
    },
});

export default store;
