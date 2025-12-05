import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Validação básica de senha
    if (password !== confirmPassword) {
      setError("As passwords não coincidem");
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError("A password deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }
    
    try {
      await register(name, email, password);
      navigate("/movies");
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Registo</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nome:{" "}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:{" "}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:{" "}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </label>
        </div>
        <div>
          <label>
            Confirmar Password:{" "}
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
