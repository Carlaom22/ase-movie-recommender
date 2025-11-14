const express = require("express");
const router = express.Router();

// RF6: recomendações personalizadas (lógica vem depois)

router.get("/test", (req, res) => {
  res.json({
    route: "recommendations",
    message: "Recommendations route OK (placeholder)"
  });
});

module.exports = router;
