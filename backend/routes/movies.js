const express = require("express");
const router = express.Router();

// RF2–RF4: pesquisa catálogo, filtros, detalhes (a implementar depois)

router.get("/test", (req, res) => {
  res.json({ route: "movies", message: "Movies route OK (placeholder)" });
});

module.exports = router;
