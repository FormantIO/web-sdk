import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { FormantProvider } from "@formant/ui-sdk";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <FormantProvider>
    <QueryClientProvider client={queryClient}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </QueryClientProvider>
  </FormantProvider>
);