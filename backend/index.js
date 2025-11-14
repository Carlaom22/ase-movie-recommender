require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db"); 

const app = express();

// Métricas
let totalRequests = 0;
const startTime = Date.now();

app.use((req, res, next) => {
  totalRequests += 1;
  next();
})

// defenido em env
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/movies", require("./routes/movies"));
app.use("/ratings", require("./routes/ratings"));
app.use("/recommendations", require("./routes/recommendations"));
app.use("/users", require("./routes/users"));

// Healthcheck 
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ase-movie-backend",
    time: new Date().toISOString()
  });
});


app.get("/metrics", (req, res) => {
  const now = Date.now();
  const uptimeSeconds = Math.round((now - startTime) / 1000);

  res.json({
    service: "ase-movie-backend",
    uptime_seconds: uptimeSeconds,
    total_requests: totalRequests,
    timestamp: new Date(now).toISOString()
  });
});



app.listen(PORT, () => {
  console.log(`Backend ASE a correr em http://localhost:${PORT}`);
});
