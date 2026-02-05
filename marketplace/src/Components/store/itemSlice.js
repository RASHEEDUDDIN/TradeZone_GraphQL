import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { itemService } from '../../services/dbService';

export const fetchItems = createAsyncThunk(
    'items/fetchItems',
    async (_, { rejectWithValue }) => {
        try {
            const items = await itemService.getAll();
            return { data: items };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createItem = createAsyncThunk(
    'items/createItem',
    async (itemData, { rejectWithValue }) => {
        try {
            const result = await itemService.create(itemData);
            return { data: { ...itemData, id: result.lastID } };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateItem = createAsyncThunk(
    'items/updateItem',
    async ({ id, itemData }, { rejectWithValue }) => {
        try {
            await itemService.update(id, itemData);
            return { id, data: itemData };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteItem = createAsyncThunk(
    'items/deleteItem',
    async (id, { rejectWithValue }) => {
        try {
            await itemService.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const itemSlice = createSlice({
    name: 'items',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.data;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createItem.fulfilled, (state, action) => {
                state.items.push(action.payload.data);
            })
            .addCase(createItem.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(updateItem.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.id);
                if (index !== -1) {
                    state.items[index] = action.payload.data;
                }
            })
            .addCase(updateItem.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(deleteItem.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

export default itemSlice.reducer;
