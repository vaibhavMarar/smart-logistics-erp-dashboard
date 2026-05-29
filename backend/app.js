require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const app = express();

const defaultOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:5000",
];

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim())
  : defaultOrigins;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn(`CORS blocked request from: ${origin}`);
      return callback(null, false);
    },
  })
);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api", customerRoutes);
app.use("/api", supplierRoutes);

// Health/root route for Render health checks
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "erp-vista-navigator-backend",
    routes: ["/api/customers", "/api/suppliers"],
  });
});

// Error handling middleware (optional, but useful)
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server only when not running tests
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
