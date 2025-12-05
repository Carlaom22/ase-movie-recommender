import { useState } from 'react';
import { authAPI } from '../services/api';
import { AuthContext } from './authContext';

export function AuthProvider({ children }) {
  // Inicialização lazy - verifica localStorage apenas uma vez
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    return (savedUser && savedToken) ? JSON.parse(savedUser) : null;
  });
  
  // isLoading sempre false após inicialização lazy
  const [isLoading, _setIsLoading] = useState(false);

  // Login
  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    const { user, token } = response.data; // response.data contém user e token
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    
    return response;
  };

  // Register
  const register = async (name, email, password) => {
    const response = await authAPI.register(name, email, password);
    const { user, token } = response.data; // response.data contém user e token
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    
    return response;
  };

  // Logout
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
        console.error('Erro no logout:', error);
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}