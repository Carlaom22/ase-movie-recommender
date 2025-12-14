const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Utilitários de autenticação e segurança
 */

/**
 * Gerar hash seguro da password
 * @param {string} password - Password em texto limpo
 * @returns {Promise<string>} - Hash da password
 */
async function hashPassword(password) {
  const saltRounds = 12; // Nível de segurança alto
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verificar se a password corresponde ao hash
 * @param {string} password - Password em texto limpo
 * @param {string} hash - Hash armazenado na base de dados
 * @returns {Promise<boolean>} - True se corresponde
 */
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Gerar token JWT para o utilizador
 * @param {Object} user - Dados do utilizador {id, email}
 * @returns {string} - Token JWT
 */
function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      issuer: 'ase-movie-recommender',
      audience: 'ase-users'
    }
  );
}

/**
 * Validar formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - True se válido
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validar força da password
 * @param {string} password - Password a validar
 * @returns {Object} - {isValid: boolean, message: string}
 */
function validatePassword(password) {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: 'Password deve ter pelo menos 6 caracteres'
    };
  }
  
  if (password.length > 128) {
    return {
      isValid: false,
      message: 'Password muito longa (máximo 128 caracteres)'
    };
  }
  
  // Verificar se tem pelo menos uma letra e um número
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      message: 'Password deve conter pelo menos uma letra e um número'
    };
  }
  
  return {
    isValid: true,
    message: 'Password válida'
  };
}

/**
 * Sanitizar dados de utilizador para resposta (remover informações sensíveis)
 * @param {Object} user - Objeto utilizador da base de dados
 * @returns {Object} - Utilizador sem dados sensíveis
 */
function sanitizeUser(user) {
  const { password_hash, ...sanitizedUser } = user;
  return sanitizedUser;
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  isValidEmail,
  validatePassword,
  sanitizeUser
};