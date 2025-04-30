const { EquityStatement, AnnualReport } = require("../models"); // Adjust path as needed

// @desc    Get equity statement for a specific annual report
// @route   GET /api/equity-statements/annual-report/:reportId
// @access  Private
const getEquityStatementByReportId = async (req, res, next) => {
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

    const equityStatement = await EquityStatement.findOne({ where: { annual_report_id: reportId } });

    if (!equityStatement) {
      return res.status(404).json({ message: "Izkaz gibanja kapitala za to poročilo ni najden." });
    }

    res.json(equityStatement);
  } catch (error) {
    next(error);
  }
};

// @desc    Update equity statement
// @route   PUT /api/equity-statements/:id
// @access  Private
const updateEquityStatement = async (req, res, next) => {
  const { id } = req.params; // This is the EquityStatement ID
  const data = req.body;

  try {
    const equityStatement = await EquityStatement.findByPk(id, {
        include: { model: AnnualReport, attributes: ["company_id"] }
    });

    if (!equityStatement) {
      return res.status(404).json({ message: "Izkaz gibanja kapitala ni najden." });
    }

    // Authorization check
    if (equityStatement.AnnualReport.company_id !== req.user.company_id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Nimate dovoljenja za posodobitev tega izkaza." });
    }

    // Update all fields provided in the body
    await equityStatement.update(data);

    // Basic validation: Check if beginning + changes = ending
    const beginningTotalEquity = 
        (parseFloat(equityStatement.beginning_called_up_capital) || 0) +
        (parseFloat(equityStatement.beginning_capital_reserves) || 0) +
        (parseFloat(equityStatement.beginning_reserves_from_profit) || 0) +
        (parseFloat(equityStatement.beginning_revaluation_reserves) || 0) +
        (parseFloat(equityStatement.beginning_fair_value_reserves) || 0) +
        (parseFloat(equityStatement.beginning_retained_earnings) || 0) +
        (parseFloat(equityStatement.beginning_net_profit) || 0);

    const changesTotalEquity = 
        (parseFloat(equityStatement.changes_called_up_capital) || 0) +
        (parseFloat(equityStatement.changes_capital_reserves) || 0) +
        (parseFloat(equityStatement.changes_reserves_from_profit) || 0) +
        (parseFloat(equityStatement.changes_revaluation_reserves) || 0) +
        (parseFloat(equityStatement.changes_fair_value_reserves) || 0) +
        (parseFloat(equityStatement.changes_retained_earnings) || 0) +
        (parseFloat(equityStatement.net_profit_for_period) || 0);

    const calculatedEndingTotalEquity = beginningTotalEquity + changesTotalEquity;

    const declaredEndingTotalEquity = 
        (parseFloat(equityStatement.ending_called_up_capital) || 0) +
        (parseFloat(equityStatement.ending_capital_reserves) || 0) +
        (parseFloat(equityStatement.ending_reserves_from_profit) || 0) +
        (parseFloat(equityStatement.ending_revaluation_reserves) || 0) +
        (parseFloat(equityStatement.ending_fair_value_reserves) || 0) +
        (parseFloat(equityStatement.ending_retained_earnings) || 0) +
        (parseFloat(equityStatement.ending_net_profit) || 0);

    const difference = Math.abs(calculatedEndingTotalEquity - declaredEndingTotalEquity);
    const validation = {
        valid: difference < 0.01,
        difference: difference,
        calculatedEndingTotalEquity: calculatedEndingTotalEquity,
        declaredEndingTotalEquity: declaredEndingTotalEquity,
        errors: difference >= 0.01 ? ["Izračunano končno stanje kapitala se ne ujema z vsoto končnih postavk (začetno stanje + spremembe)."] : []
    };

    res.json({ equityStatement, validation });

  } catch (error) {
    next(error);
  }
};

// Basic validation endpoint
// @desc    Validate equity statement
// @route   POST /api/equity-statements/:id/validate
// @access  Private
const validateEquityStatement = async (req, res, next) => {
    const { id } = req.params;
    try {
        const equityStatement = await EquityStatement.findByPk(id, {
            include: { model: AnnualReport, attributes: ["company_id"] }
        });

        if (!equityStatement) {
            return res.status(404).json({ message: "Izkaz gibanja kapitala ni najden." });
        }

        // Authorization check
        if (equityStatement.AnnualReport.company_id !== req.user.company_id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Nimate dovoljenja za validacijo tega izkaza." });
        }

        // Basic validation: Check if beginning + changes = ending
        const beginningTotalEquity = 
            (parseFloat(equityStatement.beginning_called_up_capital) || 0) +
            (parseFloat(equityStatement.beginning_capital_reserves) || 0) +
            (parseFloat(equityStatement.beginning_reserves_from_profit) || 0) +
            (parseFloat(equityStatement.beginning_revaluation_reserves) || 0) +
            (parseFloat(equityStatement.beginning_fair_value_reserves) || 0) +
            (parseFloat(equityStatement.beginning_retained_earnings) || 0) +
            (parseFloat(equityStatement.beginning_net_profit) || 0);

        const changesTotalEquity = 
            (parseFloat(equityStatement.changes_called_up_capital) || 0) +
            (parseFloat(equityStatement.changes_capital_reserves) || 0) +
            (parseFloat(equityStatement.changes_reserves_from_profit) || 0) +
            (parseFloat(equityStatement.changes_revaluation_reserves) || 0) +
            (parseFloat(equityStatement.changes_fair_value_reserves) || 0) +
            (parseFloat(equityStatement.changes_retained_earnings) || 0) +
            (parseFloat(equityStatement.net_profit_for_period) || 0);

        const calculatedEndingTotalEquity = beginningTotalEquity + changesTotalEquity;

        const declaredEndingTotalEquity = 
            (parseFloat(equityStatement.ending_called_up_capital) || 0) +
            (parseFloat(equityStatement.ending_capital_reserves) || 0) +
            (parseFloat(equityStatement.ending_reserves_from_profit) || 0) +
            (parseFloat(equityStatement.ending_revaluation_reserves) || 0) +
            (parseFloat(equityStatement.ending_fair_value_reserves) || 0) +
            (parseFloat(equityStatement.ending_retained_earnings) || 0) +
            (parseFloat(equityStatement.ending_net_profit) || 0);

        const difference = Math.abs(calculatedEndingTotalEquity - declaredEndingTotalEquity);
        const isValid = difference < 0.01;
        const errors = isValid ? [] : ["Izračunano končno stanje kapitala se ne ujema z vsoto končnih postavk (začetno stanje + spremembe)." ];

        res.json({ 
            valid: isValid, 
            errors: errors, 
            calculatedEndingTotalEquity: calculatedEndingTotalEquity.toFixed(2),
            declaredEndingTotalEquity: declaredEndingTotalEquity.toFixed(2),
            difference: difference.toFixed(2)
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
  getEquityStatementByReportId,
  updateEquityStatement,
  validateEquityStatement,
};

