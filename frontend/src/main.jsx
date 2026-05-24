import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorProvider, SuccessProvider } from "./context/ErrorContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorProvider>
      <SuccessProvider>
        <App />
      </SuccessProvider>
    </ErrorProvider>
  </React.StrictMode>
);
