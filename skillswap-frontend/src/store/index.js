import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import coursesReducer from './slices/coursesSlice';
import cartReducer from './slices/cartSlice';
import ordersReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    cart: cartReducer,
    orders: ordersReducer
  }
});

export default store;
