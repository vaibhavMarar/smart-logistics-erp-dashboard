// models/db.js
const sql = require("mssql");

// Always use default local configuration (ignore .env)
const config = {
  user: "print_admin",
  password: "Vaibhavm2136",
  server: "localhost",
  database: "Masters",
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Create and share a single connection pool across the app
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to MSSQL (default config)");
    return pool;
  })
  .catch((err) => {
    console.error(
      "Database Connection Failed:",
      err && err.message ? err.message : err
    );
    throw err;
  });

module.exports = { sql, config, poolPromise };
