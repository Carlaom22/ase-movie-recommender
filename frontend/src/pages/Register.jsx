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
      navigate("/movies");
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
    <div className="register-page">
      <div className="register-container">
        {/* Left Section - Hero */}
        <div className="hero-section">
          <div className="hero-badge">Novo por aqui?</div>
          <h1>Entra no mundo dos filmes</h1>
          <p className="hero-text">
            Cria a tua conta em menos de um minuto. Avalia filmes, recebe recomendações personalizadas e partilha com a comunidade.
          </p>
          
          <div className="benefits">
            <div className="benefit-item">
              <div className="benefit-icon">⭐</div>
              <div className="benefit-text">Avalia os teus filmes favoritos</div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🎯</div>
              <div className="benefit-text">Recomendações inteligentes</div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🔐</div>
              <div className="benefit-text">Conta segura e privada</div>
            </div>
          </div>
        </div>

        {/* Right Section - Form Card */}
        <div className="form-section">
          <div className="form-card">
            <div className="form-header">
              <h2>Criar Conta</h2>
              <p>Preenche os teus dados para começar</p>
            </div>

            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label htmlFor="name">Nome</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="O teu nome completo"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teu.email@exemplo.com"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repete a password"
                  className="input"
                />
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <>
                    <span className="spinner-small" />
                    A criar conta...
                  </>
                ) : (
                  <>
                    <span className="button-icon">✓</span>
                    Criar Conta
                  </>
                )}
              </button>

              {error && <div className="error-banner">{error}</div>}

              <div className="form-footer">
                <p>Já tens conta? <Link to="/login">Faz login aqui</Link>.</p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .register-page {
          min-height: 100vh;
          background: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 24px;
        }

        .register-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          min-height: 100vh;
          padding: 24px 0;
        }

        /* Hero Section */
        .hero-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .hero-badge {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(99, 102, 241, 0.12);
          color: #4f46e5;
          font-weight: 600;
          font-size: 13px;
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .hero-section h1 {
          margin: 0;
          font-size: 42px;
          line-height: 1.2;
          color: #0f172a;
          font-weight: 700;
        }

        .hero-text {
          margin: 0;
          font-size: 16px;
          color: #64748b;
          line-height: 1.6;
          max-width: 480px;
        }

        .benefits {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 8px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .benefit-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .benefit-text {
          color: #475569;
          font-size: 14px;
          font-weight: 500;
        }

        /* Form Section */
        .form-section {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .form-card {
          width: 100%;
          max-width: 420px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 28px;
          box-shadow: 0 20px 80px rgba(0, 0, 0, 0.08);
        }

        .form-header h2 {
          margin: 0 0 6px 0;
          color: #0f172a;
          font-size: 24px;
          font-weight: 700;
        }

        .form-header p {
          margin: 0 0 20px 0;
          color: #94a3b8;
          font-size: 14px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          color: #475569;
          font-weight: 600;
          font-size: 13px;
        }

        .input {
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #0f172a;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .input::placeholder {
          color: #cbd5e1;
        }

        .input:focus {
          outline: none;
          border-color: #4f46e5;
          background: white;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .submit-btn {
          padding: 14px 16px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 10px 30px rgba(79, 70, 229, 0.35);
          margin-top: 4px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(79, 70, 229, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .button-icon {
          font-size: 16px;
        }

        .spinner-small {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-banner {
          padding: 12px 14px;
          border-radius: 12px;
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #991b1b;
          font-weight: 600;
          font-size: 13px;
          margin-top: 4px;
        }

        .form-footer {
          margin-top: 8px;
          text-align: center;
        }

        .form-footer p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .form-footer a {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 700;
        }

        .form-footer a:hover {
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .register-container {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .hero-section h1 {
            font-size: 32px;
          }

          .form-section {
            width: 100%;
          }

          .form-card {
            max-width: 100%;
          }
        }

        @media (max-width: 640px) {
          .register-page {
            padding: 16px;
          }

          .register-container {
            padding: 12px 0;
            min-height: auto;
          }

          .hero-section h1 {
            font-size: 24px;
          }

          .hero-text {
            font-size: 14px;
          }

          .benefits {
            display: none;
          }

          .form-card {
            padding: 20px;
          }

          .form-header h2 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}
