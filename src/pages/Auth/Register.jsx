import { useState } from "react";

export function Register({ onBack, register }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  async function handleRegister() {
    if (!username.trim() || !password) {
      setError("Preencha usuário e senha");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter ao menos 6 caracteres");
      return;
    }

    setError("");
    setLoading(true);
    const { error: registerError } = await register(username, password);
    setLoading(false);

    if (registerError) {
      setError(registerError);
      return;
    }
    setSuccess(true);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleRegister();
  }

  if (success) {
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
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            textAlign: "center",
          }}
        >
          <h1 style={{ margin: 0, marginBottom: "8px", fontSize: "22px" }}>
            Conta criada!
          </h1>
          <p style={{ color: "#6b6a66", marginBottom: "24px" }}>
            Sua conta foi criada com sucesso. Você já pode começar a gerenciar as suas tarefas.
          </p>
          <button
            onClick={onBack}
            style={{
              width: "100%",
              padding: "12px",
              background: "#1a1a18",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Ir para o gerenciador de tarefas
          </button>
        </div>
      </div>
    );
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
          placeholder="Use underline no lugar de espaço: ex: Maria_Heloisa"
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
          placeholder="Senha (mín. 6 caracteres)"
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
          onClick={handleRegister}
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
          {loading ? "Criando..." : "Criar Conta"}
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