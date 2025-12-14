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
  console.log("[AUTH] POST /auth/register chamado");
  console.log("[AUTH] Dados recebidos:", req.body);

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.warn("[AUTH] Falha no registo — dados em falta");
      return res.status(400).json({
        success: false,
        message: 'Nome, email e password são obrigatórios'
      });
    }

    if (!isValidEmail(email)) {
      console.warn("[AUTH] Email inválido:", email);
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      console.warn("[AUTH] Password inválida");
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      });
    }

    console.log("[AUTH] Verificando se email já existe:", email);
    const existingUserQuery = 'SELECT id FROM users WHERE email = $1';
    const existingUser = await db.query(existingUserQuery, [email.toLowerCase()]);
    
    if (existingUser.rows.length > 0) {
      console.warn("[AUTH] Registo falhou — email já registado:", email);
      return res.status(409).json({
        success: false,
        message: 'Email já está registado'
      });
    }

    console.log("[AUTH] Hashing da password...");
    const passwordHash = await hashPassword(password);

    console.log("[AUTH] Inserindo utilizador na BD...");
    const insertQuery = `
      INSERT INTO users (name, email, password_hash) 
      VALUES ($1, $2, $3) 
      RETURNING id, name, email, created_at
    `;
    const result = await db.query(insertQuery, [name.trim(), email.toLowerCase(), passwordHash]);
    const newUser = result.rows[0];

    console.log("[AUTH] Utilizador registado com sucesso:", newUser.email);

    const token = generateToken(newUser);
    console.log("[AUTH] Token gerado para:", newUser.email);

    res.status(201).json({
      success: true,
      message: 'Utilizador registado com sucesso',
      data: {
        user: sanitizeUser(newUser),
        token
      }
    });

  } catch (error) {
    console.error("[AUTH] Erro no registo:", error);
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
  console.log("[AUTH] POST /auth/login chamado");
  console.log("[AUTH] Dados recebidos:", req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.warn("[AUTH] Falha no login — dados em falta");
      return res.status(400).json({
        success: false,
        message: 'Email e password são obrigatórios'
      });
    }

    console.log("[AUTH] Procurando utilizador na BD:", email);
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(userQuery, [email.toLowerCase()]);
    
    if (result.rows.length === 0) {
      console.warn("[AUTH] Login falhou — email não encontrado:", email);
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    const user = result.rows[0];
    console.log("[AUTH] Utilizador encontrado:", user.email);

    console.log("[AUTH] Verificando password...");
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    
    if (!isPasswordValid) {
      console.warn("[AUTH] Password incorreta para:", email);
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    console.log("[AUTH] Password correta — gerando token...");
    const token = generateToken(user);

    console.log("[AUTH] Login bem-sucedido para:", email);

    res.json({
      success: true,
      message: 'Login efetuado com sucesso',
      data: {
        user: sanitizeUser(user),
        token
      }
    });

  } catch (error) {
    console.error("[AUTH] Erro no login:", error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * GET /auth/me
 */
router.get('/me', authenticateToken, async (req, res) => {
  console.log("[AUTH] GET /auth/me chamado");
  console.log("[AUTH] User autenticado:", req.user);

  try {
    res.json({
      success: true,
      data: {
        user: sanitizeUser(req.user)
      }
    });
  } catch (error) {
    console.error("[AUTH] Erro ao obter perfil:", error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * POST /auth/logout
 */
router.post('/logout', authenticateToken, async (req, res) => {
  console.log("[AUTH] POST /auth/logout chamado");
  console.log("[AUTH] User fez logout:", req.user?.email || "(desconhecido)");

  try {
    res.json({
      success: true,
      message: 'Logout efetuado com sucesso'
    });
  } catch (error) {
    console.error("[AUTH] Erro no logout:", error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * GET /auth/test
 */
router.get('/test', (req, res) => {
  console.log("[AUTH] GET /auth/test");
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
