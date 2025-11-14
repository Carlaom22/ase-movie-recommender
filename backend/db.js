const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "ase_user",
  password: process.env.DB_PASSWORD || "ase_password",
  database: process.env.DB_NAME || "ase_movies"
});

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    console.log("Ligação à BD OK:", result.rows[0].now);
  } catch (err) {
    console.error("Erro a ligar à BD:", err.message);
  }
}

if (process.env.NODE_ENV === "development") {
  testConnection();
}

module.exports = pool;
