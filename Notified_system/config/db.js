const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("DB connected!");
  } catch (err) {
    console.error("DB connection failed", err);
    process.exit(1);
  }
})();

module.exports = pool;