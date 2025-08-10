import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppContestProvider } from "./context/AppContest.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContestProvider>
      <App />
    </AppContestProvider>
  </BrowserRouter>
);
