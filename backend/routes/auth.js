const express = require("express");
const router = express.Router();

// RF1: Registo e autenticação (a implementar nos próximos passos)

// Endpoint só para testar que a rota está ligada
router.get("/test", (req, res) => {
  res.json({ route: "auth", message: "Auth route OK (placeholder)" });
});

module.exports = router;
