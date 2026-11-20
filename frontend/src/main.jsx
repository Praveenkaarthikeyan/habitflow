import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ProfileProvider } from "./context/ProfileContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/global.css";
import "./styles/sidebar.css";
import "./styles/dashboard.css";
import "./styles/mono.css";
import "./styles/auth.css";
import "./styles/buttons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ProfileProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ProfileProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);