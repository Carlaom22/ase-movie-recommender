const express = require("express");
const router = express.Router();

// RF5: ratings de 1 a 5 (a implementar depois)

router.get("/test", (req, res) => {
  res.json({ route: "ratings", message: "Ratings route OK (placeholder)" });
});

module.exports = router;
