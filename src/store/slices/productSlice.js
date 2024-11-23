import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProducts as fetchProductsService } from "../../services/productService";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetchProductsService(
        params.page,
        params.pageSize,
        params.searchTerm,
        params.category,
        params.sortModel
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch products");
      }

      return {
        data: response.data,
        source: response.source,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedProduct: null,
    totalCount: 0,
    dataSource: null,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.products;
        state.totalCount = action.payload.data.total;
        state.dataSource = action.payload.source;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
        state.items = [];
        state.totalCount = 0;
      });
  },
});

export const { setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
