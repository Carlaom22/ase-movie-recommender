import { useEffect, useState } from "react";

export default function Movies() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch("http://localhost:3000/health");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        setHealth(data);
      } catch (err) {
        setError(err.message || "Erro ao contactar backend");
      }
    }

    fetchHealth();
  }, []);

  return (
    <div>
      <h1>Catálogo de Filmes</h1>
      <p>Aqui vais poder pesquisar, filtrar e ver a lista de filmes.</p>

      <hr style={{ margin: "1.5rem 0" }} />

      <h2>Estado do Sistema</h2>

      {!health && !error && <p>A verificar estado do backend...</p>}

      {health && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #4caf50",
            backgroundColor: "#e8f5e9",
            maxWidth: "500px",
            marginTop: "0.5rem"
          }}
        >
          <p>
            <strong>Backend:</strong> ✅ {health.status}
          </p>
          <p>
            <strong>Serviço:</strong> {health.service}
          </p>
          <p>
            <strong>Hora:</strong> {new Date(health.time).toLocaleString()}
          </p>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #f44336",
            backgroundColor: "#ffebee",
            maxWidth: "500px",
            marginTop: "0.5rem"
          }}
        >
          <p>
            <strong>Backend:</strong> ❌ indisponível
          </p>
          <p>
            <strong>Erro:</strong> {error}
          </p>
          <p>Confirma que o backend está a correr em http://localhost:3000</p>
        </div>
      )}
    </div>
  );
}
