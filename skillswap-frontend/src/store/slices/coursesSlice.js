import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/api';

export const fetchLatestCourses = createAsyncThunk('courses/latest', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/courses/latest');
    return data.courses;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to fetch latest courses' });
  }
});

export const fetchTrendingCourses = createAsyncThunk('courses/trending', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/courses/trending');
    return data.courses;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to fetch trending courses' });
  }
});

export const fetchAllCourses = createAsyncThunk('courses/all', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/courses', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to fetch courses' });
  }
});

export const fetchCourseById = createAsyncThunk('courses/byId', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/courses/${id}`);
    return data.course;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to fetch course' });
  }
});

export const searchCourses = createAsyncThunk('courses/search', async (query, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/courses/search', { params: { q: query } });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to search courses' });
  }
});

export const fetchCoursesByCategory = createAsyncThunk('courses/byCategory', async (category, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/courses/category/${category}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to fetch courses by category' });
  }
});

const initialState = {
  latest: [],
  trending: [],
  list: [],
  searchResults: [],
  categoryResults: [],
  current: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0
  },
  loading: false,
  error: null
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearCategoryResults: (state) => {
      state.categoryResults = [];
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchLatestCourses.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchLatestCourses.fulfilled, (state, action) => { state.loading = false; state.latest = action.payload; })
      .addCase(fetchLatestCourses.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })

      .addCase(fetchTrendingCourses.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchTrendingCourses.fulfilled, (state, action) => { state.loading = false; state.trending = action.payload; })
      .addCase(fetchTrendingCourses.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })

      .addCase(fetchAllCourses.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchAllCourses.fulfilled, (state, action) => { 
        state.loading = false; 
        state.list = action.payload.courses;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total
        };
      })
      .addCase(fetchAllCourses.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })

      .addCase(fetchCourseById.pending, state => { state.loading = true; state.error = null; state.current = null; })
      .addCase(fetchCourseById.fulfilled, (state, action) => { state.loading = false; state.current = action.payload; })
      .addCase(fetchCourseById.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })

      .addCase(searchCourses.pending, state => { state.loading = true; state.error = null; })
      .addCase(searchCourses.fulfilled, (state, action) => { 
        state.loading = false; 
        state.searchResults = action.payload.courses;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total
        };
      })
      .addCase(searchCourses.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })

      .addCase(fetchCoursesByCategory.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchCoursesByCategory.fulfilled, (state, action) => { 
        state.loading = false; 
        state.categoryResults = action.payload.courses;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total
        };
      })
      .addCase(fetchCoursesByCategory.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
  }
});

export const { clearSearchResults, clearCategoryResults } = coursesSlice.actions;
export default coursesSlice.reducer;
