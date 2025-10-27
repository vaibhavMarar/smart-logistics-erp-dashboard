const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const app = express();

// Enable CORS for all origins
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api", customerRoutes);
app.use("/api", supplierRoutes);

// Health/root route to avoid 404 confusion
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
