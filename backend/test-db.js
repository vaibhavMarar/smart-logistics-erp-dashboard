require("dotenv").config();

const sql = require("mssql");

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

sql
  .connect(config)
  .then((pool) => pool.request().query("SELECT TOP 1 * FROM CustomerMaster"))
  .then((result) => {
    console.log(result.recordset);
    sql.close();
  })
  .catch((err) => {
    console.error("Test DB connection error:", err);
  });
