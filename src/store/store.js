
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import adminAuthReducer from "./slices/adminAuthSlice";

// Get saved customer
const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

// Get saved admin
const getSavedAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem("admin"));
  } catch {
    return null;
  }
};

const savedUser = getSavedUser();
const savedAdmin = getSavedAdmin();

// Create Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminAuthReducer,
  },

  preloadedState: {
    auth: {
      user: savedUser,
      isAuthenticated: Boolean(savedUser),
    },

    adminAuth: {
      admin: savedAdmin,
      isAuthenticated: Boolean(savedAdmin),
    },
  },
});

// Save authentication data in localStorage
store.subscribe(() => {
  const { user } = store.getState().auth;
  const { admin } = store.getState().adminAuth;

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }

  if (admin) {
    localStorage.setItem("admin", JSON.stringify(admin));
  } else {
    localStorage.removeItem("admin");
  }
});
