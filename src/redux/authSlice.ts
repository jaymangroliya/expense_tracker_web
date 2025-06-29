// src/redux/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';

export interface User {
  userId: string; // Simulate Token
  name: string;
  role: 'admin' | 'employee';
}

interface AuthState {
  user: User | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  error: null,
};

// ✅ FIXED: Set return type explicitly to User
export const loginUser = createAsyncThunk<User, { name: string; password: string }>(
  'auth/loginUser',
  async (payload, thunkAPI) => {
    try {
      const response = await api.post('/auth/login', payload);
      return response.data; // Must be of type User
    } catch (error) {
      return thunkAPI.rejectWithValue('Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      localStorage.clear();
    }
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;