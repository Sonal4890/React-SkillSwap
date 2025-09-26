import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/api';

// Place order from cart
export const placeOrder = createAsyncThunk('orders/place', async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/orders', orderData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to place order' });
  }
});

// Get user's orders
export const fetchMyOrders = createAsyncThunk('orders/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/orders');
    return data.orders;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to fetch orders' });
  }
});

// Get order by ID
export const fetchOrderById = createAsyncThunk('orders/fetchById', async (orderId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/orders/${orderId}`);
    return data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to fetch order' });
  }
});

// Process payment
export const processPayment = createAsyncThunk('orders/processPayment', async (paymentData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/orders/payment', paymentData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to process payment' });
  }
});

// Admin: fetch all orders
export const fetchAllOrdersAdmin = createAsyncThunk('orders/fetchAllAdmin', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const { data } = await api.get(`/api/orders/admin/all${query ? `?${query}` : ''}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to fetch all orders' });
  }
});

// Admin: fetch order stats
export const fetchOrderStatsAdmin = createAsyncThunk('orders/fetchStatsAdmin', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/orders/stats');
    return data.stats;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to fetch order stats' });
  }
});

const initialState = {
  orders: [],
  currentOrder: null,
  admin: {
    list: [],
    total: 0,
    currentPage: 1,
    stats: null
  },
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: builder => {
    builder
      // Place order
      .addCase(placeOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
        state.orders.unshift(action.payload.order);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Fetch my orders
      .addCase(fetchMyOrders.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Fetch order by ID
      .addCase(fetchOrderById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Process payment
      .addCase(processPayment.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        // Update order status if needed
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Admin: all orders
      .addCase(fetchAllOrdersAdmin.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrdersAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin.list = action.payload.orders;
        state.admin.total = action.payload.total;
        state.admin.currentPage = action.payload.currentPage;
      })
      .addCase(fetchAllOrdersAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Admin: stats
      .addCase(fetchOrderStatsAdmin.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStatsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin.stats = action.payload;
      })
      .addCase(fetchOrderStatsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  }
});

export const { clearError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
