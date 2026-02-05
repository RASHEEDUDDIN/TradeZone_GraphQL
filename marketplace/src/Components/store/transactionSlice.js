import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transactionService } from '../../services/dbService';

export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async (_, { rejectWithValue }) => {
        try {
            const transactions = await transactionService.getAll();
            return { data: transactions };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createTransaction = createAsyncThunk(
    'transactions/createTransaction',
    async (transactionData, { rejectWithValue }) => {
        try {
            const result = await transactionService.create(transactionData);
            return { data: { ...transactionData, id: result.lastID } };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState: {
        transactions: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Ensure we get an array of transactions
                state.transactions = Array.isArray(action.payload.data) ? action.payload.data : [action.payload.data];
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to load transactions';
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.transactions.push(action.payload);
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

export default transactionSlice.reducer;
