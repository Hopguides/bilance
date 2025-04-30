const express = require("express");
const {
  getIncomeStatementByReportId,
  updateIncomeStatement,
  validateIncomeStatement,
} = require("../controllers/incomeStatementController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

// Get income statement associated with an annual report ID
router.get("/annual-report/:reportId", getIncomeStatementByReportId);

// Update income statement by its own ID
router.put("/:id", updateIncomeStatement);

// Validate income statement by its own ID
router.post("/:id/validate", validateIncomeStatement);

module.exports = router;

