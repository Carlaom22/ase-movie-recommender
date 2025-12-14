import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor preenche o email e a password.");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/movies");
    } catch (err) {
      console.error("Erro no login:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Credenciais inválidas. Tenta novamente.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = () => {
    // Implementar login com Google aqui
    console.log("Login com Google");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left side - Welcome message */}
        <div className="welcome-section">
          <div className="welcome-header">
            <h1>Bem-vindo de Volta</h1>
            <p>
              Acede ao teu universo pessoal de cinema.<br />
              Recomendações personalizadas, lista de favoritos<br />
              e muito mais te esperam.
            </p>
          </div>

          <div className="features">
            <div className="feature-item">
              <div className="feature-icon">🎬</div>
              <span>Catálogo completo</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⭐</div>
              <span>Recomendações personalizadas</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💾</div>
              <span>Lista de favoritos</span>
            </div>
          </div>

          <div className="divider"></div>
        </div>

        {/* Right side - Login form */}
        <div className="login-section">
          <div className="login-header">
            <h2>Iniciar Sessão</h2>
            <p>Insere as tuas credenciais para acederes à tua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Endereço de Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@gmail.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                Lembrar-me
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Esqueci-me da password
              </Link>
            </div>

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  A processar...
                </>
              ) : "Entrar na Conta"}
            </button>

            <div className="divider-line">
              <span>ou</span>
            </div>

            <button 
              type="button" 
              className="google-btn"
              onClick={handleGoogleLogin}
            >
              <span className="google-icon">G</span>
              Continuar com Google
            </button>

            <p className="register-link">
              Ainda não tens uma conta?{" "}
              <Link to="/register" className="register-cta">
                Cria uma conta agora →
              </Link>
            </p>
          </form>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .login-container {
          display: flex;
          max-width: 1000px;
          width: 100%;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .welcome-section {
          flex: 1;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
        }

        .welcome-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .welcome-header p {
          color: #475569;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .features {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 20px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .feature-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .feature-icon {
          font-size: 24px;
        }

        .feature-item span {
          color: #334155;
          font-weight: 500;
        }

        .divider {
          height: 1px;
          background: #cbd5e1;
          margin-top: 40px;
        }

        .login-section {
          flex: 1;
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .login-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .login-header p {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 32px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          color: #334155;
          font-size: 14px;
          font-weight: 500;
        }

        .form-group input {
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.2s ease;
          background: #ffffff;
          color: #0f172a;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background: #ffffff;
          color: #0f172a;
        }

        .form-group input::placeholder {
          color: #94a3b8;
        }

        .password-wrapper {
          position: relative;
        }

        .toggle-password {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          color: #64748b;
          padding: 4px;
          transition: color 0.2s ease;
        }

        .toggle-password:hover {
          color: #3b82f6;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #475569;
          cursor: pointer;
        }

        .checkbox-label input {
          display: none;
        }

        .checkmark {
          width: 18px;
          height: 18px;
          border: 2px solid #cbd5e1;
          border-radius: 4px;
          position: relative;
          transition: all 0.2s ease;
        }

        .checkbox-label input:checked + .checkmark {
          background: #3b82f6;
          border-color: #3b82f6;
        }

        .checkbox-label input:checked + .checkmark::after {
          content: '';
          position: absolute;
          left: 5px;
          top: 2px;
          width: 5px;
          height: 9px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .forgot-password {
          color: #3b82f6;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forgot-password:hover {
          color: #2563eb;
          text-decoration: underline;
        }

        .error-message {
          padding: 12px 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          color: #dc2626;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .submit-btn {
          padding: 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .divider-line {
          display: flex;
          align-items: center;
          color: #94a3b8;
          font-size: 14px;
        }

        .divider-line::before,
        .divider-line::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .divider-line span {
          padding: 0 16px;
        }

        .google-btn {
          padding: 16px;
          background: white;
          color: #334155;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .google-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .google-icon {
          width: 20px;
          height: 20px;
          background: #fff;
          color: #333;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          border: 1px solid #e2e8f0;
        }

        .register-link {
          text-align: center;
          color: #64748b;
          font-size: 14px;
          margin-top: 8px;
        }

        .register-cta {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .register-cta:hover {
          color: #2563eb;
          text-decoration: underline;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
            max-width: 500px;
          }

          .welcome-section,
          .login-section {
            padding: 40px 24px;
          }

          .welcome-header h1 {
            font-size: 28px;
          }

          .login-header h2 {
            font-size: 24px;
          }

          .features {
            margin-top: 0;
          }

          .form-options {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }

        @media (max-width: 480px) {
          .welcome-section,
          .login-section {
            padding: 32px 20px;
          }

          .welcome-header h1 {
            font-size: 24px;
          }

          .login-header h2 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}