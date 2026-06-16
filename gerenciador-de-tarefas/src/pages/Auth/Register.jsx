import { useState } from "react";

export function Register({ onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleRegister() {
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.some(
      u => u.username === username
    );

    if (exists) {
      alert("Usuário já existe");
      return;
    }

    users.push({
      id: crypto.randomUUID(),
      username,
      password
    });

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    alert("Conta criada com sucesso");
    onBack();
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
          Criar Conta
        </h1>

        <p
          style={{
            color: "#6b6a66",
            marginBottom: "24px"
          }}
        >
          Crie um usuário para acessar o sistema.
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
          onClick={handleRegister}
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
          Criar Conta
        </button>

        <button
          onClick={onBack}
          style={{
            width: "100%",
            padding: "12px",
            background: "transparent",
            border: "1px solid #e0dfd8",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}