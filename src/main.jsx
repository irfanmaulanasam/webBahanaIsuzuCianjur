// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom"; // Hapus BrowserRouter
import { router } from "./router.jsx"; // 👈 IMPORT OBJEK ROUTER DARI router.jsx
import "./main.css"
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);