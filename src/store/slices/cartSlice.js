import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.sku_code === newItem.sku_code || item.gtin === newItem.gtin
      );

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        state.items.push({
          ...newItem,
          quantity: 1,
          cartId:
            newItem.sku_code ||
            newItem.gtin ||
            newItem.id ||
            Math.random().toString(36).substr(2, 9),
        });
      }
    },
    updateQuantity: (state, action) => {
      const { cartId, quantity } = action.payload;
      const item = state.items.find(
        (item) =>
          item.cartId === cartId ||
          item.sku_code === cartId ||
          item.gtin === cartId
      );

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (item) =>
              item.cartId !== cartId &&
              item.sku_code !== cartId &&
              item.gtin !== cartId
          );
        } else {
          item.quantity = quantity;
        }
      }
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(
        (item) =>
          item.cartId !== itemId &&
          item.sku_code !== itemId &&
          item.gtin !== itemId
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
