import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import App from "./App";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import "./styles/index.css";
import { getLatestChallengeId } from "./lib/storage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "challenge/:id", element: <DashboardPage /> },
      {
        path: "home",
        element: (() => {
          const id = getLatestChallengeId();
          return id ? <Navigate to={`/challenge/${id}`} replace /> : <LandingPage />;
        })()
      }
    ]
  }
]);

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);