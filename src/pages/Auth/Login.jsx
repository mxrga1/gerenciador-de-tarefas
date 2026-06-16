import { useState } from "react";

export function Login({ onLogin, onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      u =>
        u.username === username &&
        u.password === password
    );

    if (!user) {
      alert("Usuário ou senha inválidos");
      return;
    }

    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    onLogin();
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

        <input
          placeholder="Usuário"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
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
          onChange={(e) =>
            setPassword(e.target.value)
          }
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
          style={{
            width: "100%",
            padding: "12px",
            background: "#1a1a18",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "12px"
          }}
        >
          Entrar
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