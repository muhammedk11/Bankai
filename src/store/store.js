
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

const savedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
})();

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: {
      user: savedUser,
      isAuthenticated: Boolean(savedUser),
    },
  },
});

// Sync authentication state with localStorage
store.subscribe(() => {
  const user = store.getState().auth.user;

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
});
