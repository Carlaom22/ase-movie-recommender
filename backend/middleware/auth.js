const jwt = require('jsonwebtoken');
const db = require('../db');

/**
 * Middleware de autenticação JWT
 * Verifica se o token JWT é válido e anexa os dados do utilizador ao req.user
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Extrair token do header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso requerido'
      });
    }

    // Verificar e descodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar dados atuais do utilizador na base de dados
    const userQuery = 'SELECT id, name, email, created_at FROM users WHERE id = $1';
    const result = await db.query(userQuery, [decoded.userId]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Utilizador não encontrado'
      });
    }

    // Anexar dados do utilizador ao request
    req.user = result.rows[0];
    next();
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    } else {
      console.error('Erro na autenticação:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
};

/**
 * Middleware opcional - continua mesmo sem token
 * Útil para endpoints que funcionam com ou sem autenticação
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userQuery = 'SELECT id, name, email, created_at FROM users WHERE id = $1';
      const result = await db.query(userQuery, [decoded.userId]);
      
      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    }
    
    next();
  } catch (error) {
    // Continuar sem autenticação em caso de erro
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};