
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

const savedUser = getSavedUser();

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

store.subscribe(() => {
  const { user } = store.getState().auth;

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
});
