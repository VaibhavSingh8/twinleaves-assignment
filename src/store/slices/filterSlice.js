import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filters",
  initialState: {
    searchTerm: "",
    category: "all",
    sortModel: [],
    page: 1,
    pageSize: 5,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.page = 1;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
      state.page = 1;
    },
    setSortModel: (state, action) => {
      state.sortModel = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.page = 1;
    },
    clearFilters: (state) => {
      state.searchTerm = "";
      state.category = "all";
      state.sortModel = [];
      state.page = 1;
      state.pageSize = 5;
    },
  },
});

export const {
  setSearchTerm,
  setCategory,
  setSortModel,
  setPage,
  setPageSize,
  clearFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
