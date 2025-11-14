const express = require("express");
const router = express.Router();

// RF7: perfil do utilizador (/users/me)

router.get("/test", (req, res) => {
  res.json({ route: "users", message: "Users route OK (placeholder)" });
});

module.exports = router;
