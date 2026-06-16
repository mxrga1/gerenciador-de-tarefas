import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import { Home } from "./pages/Home";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";

function App() {
  const [screen, setScreen] = useState(
    localStorage.getItem("currentUser")
      ? "home"
      : "login"
  );

  if (screen === "login") {
    return (
      <Login
        onLogin={() => setScreen("home")}
        onRegister={() => setScreen("register")}
      />
    );
  }

  if (screen === "register") {
    return (
      <Register
        onBack={() => setScreen("login")}
      />
    );
  }

  return <Home />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);