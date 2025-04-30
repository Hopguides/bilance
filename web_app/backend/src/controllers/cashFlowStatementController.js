const { CashFlowStatement, AnnualReport } = require("../models"); // Adjust path as needed

// @desc    Get cash flow statement for a specific annual report
// @route   GET /api/cash-flow-statements/annual-report/:reportId
// @access  Private
const getCashFlowStatementByReportId = async (req, res, next) => {
  const { reportId } = req.params;
  try {
    const report = await AnnualReport.findByPk(reportId);
    if (!report) {
      return res.status(404).json({ message: "Letno poročilo ni najdeno." });
    }

    // Authorization check
    if (report.company_id !== req.user.company_id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Nimate dovoljenja za dostop do tega poročila." });
    }

    const cashFlowStatement = await CashFlowStatement.findOne({ where: { annual_report_id: reportId } });

    if (!cashFlowStatement) {
      return res.status(404).json({ message: "Izkaz denarnih tokov za to poročilo ni najden." });
    }

    res.json(cashFlowStatement);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cash flow statement
// @route   PUT /api/cash-flow-statements/:id
// @access  Private
const updateCashFlowStatement = async (req, res, next) => {
  const { id } = req.params; // This is the CashFlowStatement ID
  const data = req.body;

  try {
    const cashFlowStatement = await CashFlowStatement.findByPk(id, {
        include: { model: AnnualReport, attributes: ["company_id"] }
    });

    if (!cashFlowStatement) {
      return res.status(404).json({ message: "Izkaz denarnih tokov ni najden." });
    }

    // Authorization check
    if (cashFlowStatement.AnnualReport.company_id !== req.user.company_id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Nimate dovoljenja za posodobitev tega izkaza." });
    }

    // Update all fields provided in the body
    await cashFlowStatement.update(data);

    // Basic validation: Check if beginning balance + net flow = end balance
    const operatingCashFlow = 
        (parseFloat(cashFlowStatement.operating_inflows) || 0) - (parseFloat(cashFlowStatement.operating_outflows) || 0);
    const investingCashFlow = 
        (parseFloat(cashFlowStatement.investing_inflows) || 0) - (parseFloat(cashFlowStatement.investing_outflows) || 0);
    const financingCashFlow = 
        (parseFloat(cashFlowStatement.financing_inflows) || 0) - (parseFloat(cashFlowStatement.financing_outflows) || 0);
    const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;
    const beginningBalance = parseFloat(cashFlowStatement.beginning_balance) || 0;
    const calculatedEndBalance = beginningBalance + netCashFlow;
    const declaredEndBalance = parseFloat(cashFlowStatement.end_balance) || 0;
    const difference = Math.abs(calculatedEndBalance - declaredEndBalance);
    const validation = {
        valid: difference < 0.01,
        difference: difference,
        calculatedEndBalance: calculatedEndBalance,
        declaredEndBalance: declaredEndBalance,
        errors: difference >= 0.01 ? ["Izračunano končno stanje se ne ujema z vnesenim (začetno stanje + neto denarni tok)."] : []
    };

    res.json({ cashFlowStatement, validation });

  } catch (error) {
    next(error);
  }
};

// Basic validation endpoint
// @desc    Validate cash flow statement
// @route   POST /api/cash-flow-statements/:id/validate
// @access  Private
const validateCashFlowStatement = async (req, res, next) => {
    const { id } = req.params;
    try {
        const cashFlowStatement = await CashFlowStatement.findByPk(id, {
            include: { model: AnnualReport, attributes: ["company_id"] }
        });

        if (!cashFlowStatement) {
            return res.status(404).json({ message: "Izkaz denarnih tokov ni najden." });
        }

        // Authorization check
        if (cashFlowStatement.AnnualReport.company_id !== req.user.company_id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Nimate dovoljenja za validacijo tega izkaza." });
        }

        // Basic validation: Check if beginning balance + net flow = end balance
        const operatingCashFlow = 
            (parseFloat(cashFlowStatement.operating_inflows) || 0) - (parseFloat(cashFlowStatement.operating_outflows) || 0);
        const investingCashFlow = 
            (parseFloat(cashFlowStatement.investing_inflows) || 0) - (parseFloat(cashFlowStatement.investing_outflows) || 0);
        const financingCashFlow = 
            (parseFloat(cashFlowStatement.financing_inflows) || 0) - (parseFloat(cashFlowStatement.financing_outflows) || 0);
        const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;
        const beginningBalance = parseFloat(cashFlowStatement.beginning_balance) || 0;
        const calculatedEndBalance = beginningBalance + netCashFlow;
        const declaredEndBalance = parseFloat(cashFlowStatement.end_balance) || 0;
        const difference = Math.abs(calculatedEndBalance - declaredEndBalance);
        const isValid = difference < 0.01;
        const errors = isValid ? [] : ["Izračunano končno stanje se ne ujema z vnesenim (začetno stanje + neto denarni tok)." ];

        res.json({ 
            valid: isValid, 
            errors: errors, 
            calculatedEndBalance: calculatedEndBalance.toFixed(2),
            declaredEndBalance: declaredEndBalance.toFixed(2),
            difference: difference.toFixed(2)
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
  getCashFlowStatementByReportId,
  updateCashFlowStatement,
  validateCashFlowStatement,
};

