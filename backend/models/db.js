require("dotenv").config();

const sql = require("mssql");

const isTest = process.env.NODE_ENV === "test";

const requiredEnvVars = ["DB_USER", "DB_PASSWORD", "DB_SERVER", "DB_DATABASE"];
if (!isTest) {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required database environment variables: ${missing.join(", ")}`
    );
  }
}

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || "1433", 10),
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== "false",
  },
};

const poolPromise = isTest
  ? Promise.resolve(null)
  : new sql.ConnectionPool(config)
      .connect()
      .then((pool) => {
        console.log(`Connected to MSSQL at ${config.server}/${config.database}`);
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
