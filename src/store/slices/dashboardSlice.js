// 💻 Felipe Gonzaga - Frontend Developer
// 💼 Larissa Oliveira - Product Manager
// Slice do Redux para dashboard

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao carregar dashboard');
    }
  }
);

export const fetchSalesChart = createAsyncThunk(
  'dashboard/fetchSalesChart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard/sales-chart');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

export const fetchFinancialChart = createAsyncThunk(
  'dashboard/fetchFinancialChart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard/financial-chart');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    data: null,
    salesChart: null,
    financialChart: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDashboard: (state) => {
      state.data = null;
      state.salesChart = null;
      state.financialChart = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Dashboard Data
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Sales Chart
    builder
      .addCase(fetchSalesChart.fulfilled, (state, action) => {
        state.salesChart = action.payload;
      });

    // Fetch Financial Chart
    builder
      .addCase(fetchFinancialChart.fulfilled, (state, action) => {
        state.financialChart = action.payload;
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;