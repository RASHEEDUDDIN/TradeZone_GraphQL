import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const validateLogin = createAsyncThunk(
  'auth/validateLogin',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/findAll/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
        },
      });
      const data = await response.json();
      console.log(data)
      if (response.ok && data.status === 'success') {
        const user = data.data.find((u) => u.user === username && u.pass === password);

        if (user) {
          return user;
        } else {
          return rejectWithValue('Invalid username or password');
        }
      } else {
        return rejectWithValue('Failed to fetch users.');
      }
    } catch (error) {
      return rejectWithValue('An error occurred during login.');
    }
  }
);
