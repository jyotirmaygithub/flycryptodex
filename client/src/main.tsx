import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { AppProvider } from "./context/AppContext";
import { queryClient } from "./lib/queryClient";

// Apply dark theme by default
document.documentElement.classList.add('dark');

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <App />
    </AppProvider>
  </QueryClientProvider>
);
