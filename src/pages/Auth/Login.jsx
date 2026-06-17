import { useState } from "react";

export function Login({ onLoginSuccess, onRegister, login }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password) {
      setError("Preencha usuário e senha");
      return;
    }
    setError("");
    setLoading(true);
    const { error: loginError } = await login(username, password);
    setLoading(false);

    if (loginError) {
      setError(loginError);
      return;
    }
    onLoginSuccess();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f4ef"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "#fff",
          border: "1px solid #e0dfd8",
          borderRadius: "12px",
          padding: "32px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
        }}
      >
        <h1
          style={{
            margin: 0,
            marginBottom: "8px",
            fontSize: "24px"
          }}
        >
          Gerenciador de Tarefas
        </h1>

        <p
          style={{
            color: "#6b6a66",
            marginBottom: "24px"
          }}
        >
          Faça login para acessar seu quadro.
        </p>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              borderRadius: "8px",
              padding: "10px 12px",
              fontSize: "13px",
              marginBottom: "12px",
            }}
          >
            {error}
          </div>
        )}

        <input
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "8px",
            border: "1px solid #d8d8d8",
            boxSizing: "border-box"
          }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "16px",
            borderRadius: "8px",
            border: "1px solid #d8d8d8",
            boxSizing: "border-box"
          }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: loading ? "#5b5b58" : "#1a1a18",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "default" : "pointer",
            marginBottom: "12px"
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <button
          onClick={onRegister}
          style={{
            width: "100%",
            padding: "12px",
            background: "transparent",
            border: "1px solid #e0dfd8",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Criar conta
        </button>
      </div>
    </div>
  );
}