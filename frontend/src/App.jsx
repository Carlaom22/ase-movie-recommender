import { Link, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { useAuth } from "./hooks/useAuth.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Movies from "./pages/Movies.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import Profile from "./pages/Profile.jsx";

// Componente de navegação que usa useAuth
function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      {isAuthenticated ? (
        // Links para usuários logados
        <>
          <Link to="/movies" style={{ marginRight: "1rem" }}>
            Catálogo
          </Link>
          <Link to="/recommendations" style={{ marginRight: "1rem" }}>
            Recomendações
          </Link>
          <Link to="/profile" style={{ marginRight: "1rem" }}>
            Perfil
          </Link>
          <button 
            onClick={logout}
            style={{ 
              background: 'none', 
              border: '1px solid #ccc', 
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            Logout
          </button>
        </>
      ) : (
        // Links para usuários não logados
        <>
          <Link to="/login" style={{ marginRight: "1rem" }}>
            Login
          </Link>
          <Link to="/register">Registo</Link>
        </>
      )}
    </nav>
  );
}

// App content com rotas
function AppContent() {
  return (
    <div>
      <Navigation />

      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute><Movies /></ProtectedRoute>
          } />
          <Route path="/movies" element={
            <ProtectedRoute><Movies /></ProtectedRoute>
          } />
          <Route path="/recommendations" element={
            <ProtectedRoute><Recommendations /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

// App principal com AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
