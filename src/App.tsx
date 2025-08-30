import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Optional: If the app becomes dashboard-first later, you can auto-redirect here.
  // For now, we preserve explicit navigation via LandingPage CTA.

  return (
    <div className="min-h-screen relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(800px 400px at 50% -100px, rgba(110,249,182,0.15), transparent 70%), radial-gradient(600px 300px at 80% 0, rgba(155,124,250,0.12), transparent 70%)"
        }}
      />
      <Outlet />
    </div>
  );
};
export default App;