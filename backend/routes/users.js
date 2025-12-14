const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/auth");
const { sanitizeUser } = require("../utils/auth");

// RF7: perfil do utilizador (/users/me)

// Endpoint de teste (mantido)
router.get("/test", (req, res) => {
  res.json({
    route: "users",
    message: "Users route OK",
    endpoints: ["/users/me"],
  });
});

/**
 * GET /users/me
 * Devolve o perfil completo do utilizador autenticado
 */
router.get("/me", authenticateToken, (req, res) => {
  try {
    if (!req.user) {
      // Em princípio não acontece porque authenticateToken já valida
      return res.status(401).json({
        success: false,
        message: "Não autenticado",
      });
    }

    const safeUser = sanitizeUser(req.user);

    return res.json({
      success: true,
      data: {
        user: safeUser,
      },
    });
  } catch (error) {
    console.error("Erro em /users/me:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno ao obter perfil do utilizador",
    });
  }
});

module.exports = router;
