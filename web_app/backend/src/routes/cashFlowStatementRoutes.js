const express = require("express");
const {
  getCashFlowStatementByReportId,
  updateCashFlowStatement,
  validateCashFlowStatement,
} = require("../controllers/cashFlowStatementController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

// Get cash flow statement associated with an annual report ID
router.get("/annual-report/:reportId", getCashFlowStatementByReportId);

// Update cash flow statement by its own ID
router.put("/:id", updateCashFlowStatement);

// Validate cash flow statement by its own ID
router.post("/:id/validate", validateCashFlowStatement);

module.exports = router;

