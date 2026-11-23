import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import {QueryClient,QueryClientProvider} from "@tanstack/react-query";

import { store } from "./store/store";
import "./index.css";
import App from "./App.jsx";

// Create the TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Provider store={store}>
          <App />
          <Toaster position="top-right" />
        </Provider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
