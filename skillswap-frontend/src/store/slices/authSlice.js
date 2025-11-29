import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/api';

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/auth/register', payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Registration failed' });
  }
});

export const loginUser = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/auth/login', payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Login failed' });
  }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    // If current path is admin, call the admin-specific me endpoint to bind to admin cookie
    const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
    const endpoint = isAdminPath ? '/api/auth/admin/me' : '/api/auth/me';
    const { data } = await api.get(endpoint);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Fetch me failed' });
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await api.get('/api/auth/logout');
});

const initialState = {
  user: null,
  loading: true,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutState(state) {
      state.user = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })

      .addCase(loginUser.pending, state => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })

      .addCase(fetchMe.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchMe.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; })
      .addCase(fetchMe.rejected, (state) => { state.loading = false; /* do not set error on unauthenticated */ })

      .addCase(logoutUser.fulfilled, (state) => { state.user = null; });
  }
});

export const { logoutState } = authSlice.actions;
export default authSlice.reducer;
