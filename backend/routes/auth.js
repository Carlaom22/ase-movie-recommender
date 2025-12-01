const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const {
  hashPassword,
  verifyPassword,
  generateToken,
  isValidEmail,
  validatePassword,
  sanitizeUser
} = require('../utils/auth');

/**
 * RF1: Registo e autenticação de utilizadores
 */

/**
 * POST /auth/register
 * Regista um novo utilizador
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validação de dados obrigatórios
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e password são obrigatórios'
      });
    }

    // Validação de email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Validação de password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      });
    }

    // Verificar se email já existe
    const existingUserQuery = 'SELECT id FROM users WHERE email = $1';
    const existingUser = await db.query(existingUserQuery, [email.toLowerCase()]);
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email já está registado'
      });
    }

    // Hash da password
    const passwordHash = await hashPassword(password);

    // Inserir novo utilizador
    const insertQuery = `
      INSERT INTO users (name, email, password_hash) 
      VALUES ($1, $2, $3) 
      RETURNING id, name, email, created_at
    `;
    const result = await db.query(insertQuery, [name.trim(), email.toLowerCase(), passwordHash]);
    const newUser = result.rows[0];

    // Gerar token JWT
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Utilizador registado com sucesso',
      data: {
        user: sanitizeUser(newUser),
        token
      }
    });

  } catch (error) {
    console.error('Erro no registo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * POST /auth/login
 * Autentica um utilizador existente
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação de dados obrigatórios
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e password são obrigatórios'
      });
    }

    // Buscar utilizador na base de dados
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(userQuery, [email.toLowerCase()]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    const user = result.rows[0];

    // Verificar password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Gerar token JWT
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login efetuado com sucesso',
      data: {
        user: sanitizeUser(user),
        token
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * GET /auth/me
 * Obter dados do utilizador autenticado
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: sanitizeUser(req.user)
      }
    });
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * POST /auth/logout
 * Termina a sessão (cliente deve remover o token)
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // No JWT não precisamos de invalidar no servidor
    // O cliente deve remover o token do armazenamento local
    res.json({
      success: true,
      message: 'Logout efetuado com sucesso'
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * GET /auth/test
 * Endpoint de teste (mantido para compatibilidade)
 */
router.get('/test', (req, res) => {
  res.json({ 
    route: 'auth', 
    message: 'Auth route OK - JWT implementado',
    endpoints: [
      'POST /auth/register',
      'POST /auth/login', 
      'GET /auth/me',
      'POST /auth/logout'
    ]
  });
});

module.exports = router;
