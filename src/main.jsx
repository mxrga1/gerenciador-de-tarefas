import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { useAuth } from "./pages/Auth/Useauth";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { Home } from "./pages/Home";

function App() {
  const { user, loading, login, register, logout } = useAuth();
  const [screen, setScreen] = useState("login");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  function handleLogout() {
    logout();
    setScreen("login");
  }

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", color: "#6b6a66", fontFamily: "sans-serif",
      }}>
        Carregando...
      </div>
    );
  }

  if (registrationSuccess) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", justifyContent: "center",
        alignItems: "center", background: "#f5f4ef"
      }}>
        <div style={{
          width: "100%", maxWidth: "380px", background: "#fff",
          border: "1px solid #e0dfd8", borderRadius: "12px", padding: "32px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)", textAlign: "center",
        }}>
          <h1 style={{ margin: 0, marginBottom: "8px", fontSize: "22px" }}>Conta criada!</h1>
          <p style={{ color: "#6b6a66", marginBottom: "24px" }}>
            Sua conta foi criada com sucesso. Você já pode fazer login.
          </p>
          <button
            onClick={() => { setRegistrationSuccess(false); setScreen("login"); }}
            style={{
              width: "100%", padding: "12px", background: "#1a1a18",
              color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer",
            }}
          >
            Ir para o login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    if (screen === "register") {
      return (
        <Register
          onBack={() => setScreen("login")}
          register={async (username, password) => {
            const result = await register(username, password);
            if (!result.error) {
              setScreen("login");
              setRegistrationSuccess(true);
            }
            return result;
          }}
        />
      );
    }
    return (
      <Login
        login={login}
        onRegister={() => setScreen("register")}
        onLoginSuccess={() => {}}
      />
    );
  }

  return <Home user={user} onLogout={handleLogout} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);