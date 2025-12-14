import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor preenche todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As passwords não coincidem.");
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);

      // Se o register já fizer login automático:
      navigate("/movies");

      // Se preferires que vá para login em vez de movies, troca por:
      // navigate("/login");
    } catch (err) {
      console.error("Erro no registo:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao criar conta. Tenta novamente.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "2rem auto",
        padding: "2rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h1 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Criar conta</h1>
      <p style={{ marginTop: 0, marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        Regista-te para começares a avaliar filmes e receberes recomendações
        personalizadas.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>
            Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="O teu nome"
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="o.teu.email@exemplo.com"
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Escolhe uma password forte"
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>
            Confirmar password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repete a password"
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.6rem 0.8rem",
            borderRadius: "4px",
            border: "1px solid #2e7d32",
            background: "#4caf50",
            color: "#fff",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "A criar conta..." : "Criar conta"}
        </button>

        {error && (
          <div
            style={{
              marginTop: "0.75rem",
              color: "#d32f2f",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        <p style={{ marginTop: "1.25rem", fontSize: "0.9rem" }}>
          Já tens conta?{" "}
          <Link to="/login" style={{ color: "#1976d2" }}>
            Faz login aqui
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
