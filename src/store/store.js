// 💻 Felipe Gonzaga - Frontend Developer
// Configuração do Redux Store

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';
import productReducer from './slices/productSlice';
import saleReducer from './slices/saleSlice';
import financialReducer from './slices/financialSlice';
import dashboardReducer from './slices/dashboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,  
    customers: customerReducer,
    products: productReducer,
    sales: saleReducer,
    financial: financialReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;