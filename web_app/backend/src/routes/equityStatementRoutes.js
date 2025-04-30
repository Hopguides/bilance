const express = require("express");
const {
  getEquityStatementByReportId,
  updateEquityStatement,
  validateEquityStatement,
} = require("../controllers/equityStatementController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

// Get equity statement associated with an annual report ID
router.get("/annual-report/:reportId", getEquityStatementByReportId);

// Update equity statement by its own ID
router.put("/:id", updateEquityStatement);

// Validate equity statement by its own ID
router.post("/:id/validate", validateEquityStatement);

module.exports = router;

