
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import wishlistReducer from "./slices/wishlistSlice";

const getSavedData = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
};

const savedUser = getSavedData("user");
const savedCart = getSavedData("cart");
const savedOrders = getSavedData("orders");
const savedWishlist = getSavedData("wishlist");

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    orders: orderReducer,
    wishlist: wishlistReducer,
  },

  preloadedState: {
    auth: {
      user: savedUser,
      isAuthenticated: Boolean(savedUser),
    },
    cart: {
      items: Array.isArray(savedCart) ? savedCart : [],
    },
    orders: {
      items: Array.isArray(savedOrders) ? savedOrders : [],
    },
    wishlist: {
      items: Array.isArray(savedWishlist) ? savedWishlist : [],
    },
  },
});

store.subscribe(() => {
  const state = store.getState();

  if (state.auth.user) {
    localStorage.setItem("user", JSON.stringify(state.auth.user));
  } else {
    localStorage.removeItem("user");
  }

  localStorage.setItem("cart", JSON.stringify(state.cart.items));
  localStorage.setItem("orders", JSON.stringify(state.orders.items));
  localStorage.setItem("wishlist", JSON.stringify(state.wishlist.items));
});
