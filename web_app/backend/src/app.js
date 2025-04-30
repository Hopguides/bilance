require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models"); // Import Sequelize models
const errorHandler = require("./middleware/errorHandler");

// Import routes
const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const annualReportRoutes = require("./routes/annualReportRoutes");
const balanceSheetRoutes = require("./routes/balanceSheetRoutes");
const incomeStatementRoutes = require("./routes/incomeStatementRoutes");
const cashFlowStatementRoutes = require("./routes/cashFlowStatementRoutes");
const equityStatementRoutes = require("./routes/equityStatementRoutes");
// Add other routes as they are created

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Database synchronization (consider using migrations for production)
db.sequelize.sync({ alter: true }) // Use { force: true } to drop and recreate tables (use with caution)
  .then(() => {
    console.log("Database synchronized.");
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/annual-reports", annualReportRoutes);
app.use("/api/balance-sheets", balanceSheetRoutes);
app.use("/api/income-statements", incomeStatementRoutes);
app.use("/api/cash-flow-statements", cashFlowStatementRoutes);
app.use("/api/equity-statements", equityStatementRoutes);
// Mount other routes here

// Simple route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Slovenian Accounting System API." });
});

// Error Handling Middleware (should be last)
app.use(errorHandler);

module.exports = app;

