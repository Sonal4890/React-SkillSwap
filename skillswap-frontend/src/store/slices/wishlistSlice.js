import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/api';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try { 
    const { data } = await api.get('/api/wishlist'); 
    return data.wishlist; 
  }
  catch (err) { 
    return rejectWithValue(err.response?.data || { message: 'Failed to fetch wishlist' }); 
  }
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (courseId, { rejectWithValue }) => {
  try { 
    const { data } = await api.post('/api/wishlist', { courseId }); 
    return data.wishlist; 
  }
  catch (err) { 
    return rejectWithValue(err.response?.data || { message: 'Failed to add to wishlist' }); 
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (courseId, { rejectWithValue }) => {
  try { 
    const { data } = await api.delete(`/api/wishlist/${courseId}`); 
    return data.wishlist; 
  }
  catch (err) { 
    return rejectWithValue(err.response?.data || { message: 'Failed to remove from wishlist' }); 
  }
});

export const clearWishlist = createAsyncThunk('wishlist/clear', async (_, { rejectWithValue }) => {
  try { 
    const { data } = await api.delete('/api/wishlist'); 
    return data.wishlist; 
  }
  catch (err) { 
    return rejectWithValue(err.response?.data || { message: 'Failed to clear wishlist' }); 
  }
});

export const checkWishlist = createAsyncThunk('wishlist/check', async (courseId, { rejectWithValue }) => {
  try { 
    const { data } = await api.get(`/api/wishlist/check/${courseId}`); 
    return { courseId, inWishlist: data.inWishlist }; 
  }
  catch (err) { 
    return rejectWithValue(err.response?.data || { message: 'Failed to check wishlist' }); 
  }
});

const initialState = { 
  wishlist: null, 
  count: 0,
  loading: false, 
  error: null 
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWishlist.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchWishlist.fulfilled, (state, action) => { 
        state.loading = false; 
        state.wishlist = action.payload;
        state.count = action.payload?.courses?.length || 0;
      })
      .addCase(fetchWishlist.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload?.message; 
      })

      .addCase(addToWishlist.pending, state => { state.loading = true; state.error = null; })
      .addCase(addToWishlist.fulfilled, (state, action) => { 
        state.loading = false; 
        state.wishlist = action.payload;
        state.count = action.payload?.courses?.length || 0;
      })
      .addCase(addToWishlist.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload?.message; 
      })

      .addCase(removeFromWishlist.pending, state => { state.loading = true; state.error = null; })
      .addCase(removeFromWishlist.fulfilled, (state, action) => { 
        state.loading = false; 
        state.wishlist = action.payload;
        state.count = action.payload?.courses?.length || 0;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload?.message; 
      })

      .addCase(clearWishlist.pending, state => { state.loading = true; state.error = null; })
      .addCase(clearWishlist.fulfilled, (state, action) => { 
        state.loading = false; 
        state.wishlist = action.payload;
        state.count = 0;
      })
      .addCase(clearWishlist.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload?.message; 
      })

      .addCase(checkWishlist.pending, state => { state.loading = true; state.error = null; })
      .addCase(checkWishlist.fulfilled, (state, action) => { 
        state.loading = false; 
        // This is handled in the component level
      })
      .addCase(checkWishlist.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload?.message; 
      });
  }
});

export const { clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
