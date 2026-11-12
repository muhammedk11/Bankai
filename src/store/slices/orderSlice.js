
import { createSlice } from "@reduxjs/toolkit";

const savedOrders = JSON.parse(
  localStorage.getItem("orders") || "[]"
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    items: savedOrders,
  },
  reducers: {
    addOrder: (state, action) => {
      state.items.unshift(action.payload);
    },
  },
});

export const { addOrder } = orderSlice.actions;
export default orderSlice.reducer;
