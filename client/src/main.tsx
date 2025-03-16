import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import App from "./App";
import "./index.css";
import { AppProvider } from "./context/AppContext";
import { queryClient } from "./lib/queryClient";

// Apply dark theme by default
document.documentElement.classList.add('dark');

// First, ensure the DOM is loaded
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <App />
        </AppProvider>
      </QueryClientProvider>
    </StrictMode>
  );
} else {
  console.error("Root element not found");
}
