import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/api';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try { 
    const { data } = await api.get('/api/cart'); 
    return data.cart; 
  }
  catch (err) { 
    return rejectWithValue(err.response?.data || { message: 'Failed to fetch cart' }); 
  }
});

export const addToCart = createAsyncThunk('cart/add', async (courseId, { rejectWithValue }) => {
  try { 
    const { data } = await api.post('/api/cart', { courseId }); 
    return data.cart; 
  }
  catch (err) { 
    return rejectWithValue(err.response?.data || { message: 'Failed to add to cart' }); 
  }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (courseId, { rejectWithValue }) => {
  try { 
    const { data } = await api.delete(`/api/cart/${courseId}`); 
    return data.cart; 
  }
  catch (err) { 
    return rejectWithValue(err.response?.data || { message: 'Failed to remove from cart' }); 
  }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try { 
    const { data } = await api.delete('/api/cart'); 
    return data.cart; 
  }
  catch (err) { 
    return rejectWithValue(err.response?.data || { message: 'Failed to clear cart' }); 
  }
});

export const getCartCount = createAsyncThunk('cart/count', async (_, { rejectWithValue }) => {
  try { 
    const { data } = await api.get('/api/cart/count'); 
    return data.count; 
  }
  catch (err) { 
    return rejectWithValue(err.response?.data || { message: 'Failed to get cart count' }); 
  }
});

const initialState = { 
  cart: null, 
  count: 0,
  loading: false, 
  error: null 
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchCart.fulfilled, (state, action) => { 
        state.loading = false; 
        state.cart = action.payload;
        state.count = action.payload?.totalItems || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload?.message; 
      })

      .addCase(addToCart.pending, state => { state.loading = true; state.error = null; })
      .addCase(addToCart.fulfilled, (state, action) => { 
        state.loading = false; 
        state.cart = action.payload;
        state.count = action.payload?.totalItems || 0;
      })
      .addCase(addToCart.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload?.message; 
      })

      .addCase(removeFromCart.pending, state => { state.loading = true; state.error = null; })
      .addCase(removeFromCart.fulfilled, (state, action) => { 
        state.loading = false; 
        state.cart = action.payload;
        state.count = action.payload?.totalItems || 0;
      })
      .addCase(removeFromCart.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload?.message; 
      })

      .addCase(clearCart.pending, state => { state.loading = true; state.error = null; })
      .addCase(clearCart.fulfilled, (state, action) => { 
        state.loading = false; 
        state.cart = action.payload;
        state.count = 0;
      })
      .addCase(clearCart.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload?.message; 
      })

      .addCase(getCartCount.pending, state => { state.loading = true; state.error = null; })
      .addCase(getCartCount.fulfilled, (state, action) => { 
        state.loading = false; 
        state.count = action.payload;
      })
      .addCase(getCartCount.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload?.message; 
      });
  }
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
