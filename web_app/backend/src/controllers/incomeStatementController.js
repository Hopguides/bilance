const { IncomeStatement, AnnualReport } = require("../models"); // Adjust path as needed

// @desc    Get income statement for a specific annual report
// @route   GET /api/income-statements/annual-report/:reportId
// @access  Private
const getIncomeStatementByReportId = async (req, res, next) => {
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

    const incomeStatement = await IncomeStatement.findOne({ where: { annual_report_id: reportId } });

    if (!incomeStatement) {
      return res.status(404).json({ message: "Izkaz poslovnega izida za to poročilo ni najden." });
    }

    res.json(incomeStatement);
  } catch (error) {
    next(error);
  }
};

// @desc    Update income statement
// @route   PUT /api/income-statements/:id
// @access  Private
const updateIncomeStatement = async (req, res, next) => {
  const { id } = req.params; // This is the IncomeStatement ID
  const data = req.body;

  try {
    const incomeStatement = await IncomeStatement.findByPk(id, {
        include: { model: AnnualReport, attributes: ["company_id"] }
    });

    if (!incomeStatement) {
      return res.status(404).json({ message: "Izkaz poslovnega izida ni najden." });
    }

    // Authorization check
    if (incomeStatement.AnnualReport.company_id !== req.user.company_id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Nimate dovoljenja za posodobitev tega izkaza." });
    }

    // Update all fields provided in the body
    await incomeStatement.update(data);

    // Basic validation: Check if calculated net profit matches declared net profit
    const totalRevenue = 
        (parseFloat(incomeStatement.net_sales_revenue) || 0) +
        (parseFloat(incomeStatement.change_in_inventory_value) || 0) +
        (parseFloat(incomeStatement.capitalized_own_products) || 0) +
        (parseFloat(incomeStatement.other_operating_revenue) || 0) +
        (parseFloat(incomeStatement.financial_revenue_from_shares) || 0) +
        (parseFloat(incomeStatement.financial_revenue_from_loans) || 0) +
        (parseFloat(incomeStatement.financial_revenue_from_receivables) || 0) +
        (parseFloat(incomeStatement.other_revenue) || 0);

    const totalExpenses = 
        (parseFloat(incomeStatement.costs_of_goods_materials_services) || 0) +
        (parseFloat(incomeStatement.labor_costs) || 0) +
        (parseFloat(incomeStatement.write_offs) || 0) +
        (parseFloat(incomeStatement.other_operating_expenses) || 0) +
        (parseFloat(incomeStatement.financial_expenses_from_impairment) || 0) +
        (parseFloat(incomeStatement.financial_expenses_from_liabilities) || 0) +
        (parseFloat(incomeStatement.financial_expenses_from_payables) || 0) +
        (parseFloat(incomeStatement.other_expenses) || 0) +
        (parseFloat(incomeStatement.income_tax) || 0) +
        (parseFloat(incomeStatement.deferred_tax) || 0);

    const calculatedNetProfit = totalRevenue - totalExpenses;
    const declaredNetProfit = parseFloat(incomeStatement.net_profit) || 0;
    const difference = Math.abs(calculatedNetProfit - declaredNetProfit);
    const validation = {
        valid: difference < 0.01,
        difference: difference,
        calculatedNetProfit: calculatedNetProfit,
        declaredNetProfit: declaredNetProfit,
        errors: difference >= 0.01 ? ["Izračunani čisti poslovni izid se ne ujema z vnesenim."] : []
    };

    res.json({ incomeStatement, validation });

  } catch (error) {
    next(error);
  }
};

// Basic validation endpoint
// @desc    Validate income statement
// @route   POST /api/income-statements/:id/validate
// @access  Private
const validateIncomeStatement = async (req, res, next) => {
    const { id } = req.params;
    try {
        const incomeStatement = await IncomeStatement.findByPk(id, {
            include: { model: AnnualReport, attributes: ["company_id"] }
        });

        if (!incomeStatement) {
            return res.status(404).json({ message: "Izkaz poslovnega izida ni najden." });
        }

        // Authorization check
        if (incomeStatement.AnnualReport.company_id !== req.user.company_id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Nimate dovoljenja za validacijo tega izkaza." });
        }

        // Basic validation: Check if calculated net profit matches declared net profit
        const totalRevenue = 
            (parseFloat(incomeStatement.net_sales_revenue) || 0) +
            (parseFloat(incomeStatement.change_in_inventory_value) || 0) +
            (parseFloat(incomeStatement.capitalized_own_products) || 0) +
            (parseFloat(incomeStatement.other_operating_revenue) || 0) +
            (parseFloat(incomeStatement.financial_revenue_from_shares) || 0) +
            (parseFloat(incomeStatement.financial_revenue_from_loans) || 0) +
            (parseFloat(incomeStatement.financial_revenue_from_receivables) || 0) +
            (parseFloat(incomeStatement.other_revenue) || 0);

        const totalExpenses = 
            (parseFloat(incomeStatement.costs_of_goods_materials_services) || 0) +
            (parseFloat(incomeStatement.labor_costs) || 0) +
            (parseFloat(incomeStatement.write_offs) || 0) +
            (parseFloat(incomeStatement.other_operating_expenses) || 0) +
            (parseFloat(incomeStatement.financial_expenses_from_impairment) || 0) +
            (parseFloat(incomeStatement.financial_expenses_from_liabilities) || 0) +
            (parseFloat(incomeStatement.financial_expenses_from_payables) || 0) +
            (parseFloat(incomeStatement.other_expenses) || 0) +
            (parseFloat(incomeStatement.income_tax) || 0) +
            (parseFloat(incomeStatement.deferred_tax) || 0);

        const calculatedNetProfit = totalRevenue - totalExpenses;
        const declaredNetProfit = parseFloat(incomeStatement.net_profit) || 0;
        const difference = Math.abs(calculatedNetProfit - declaredNetProfit);
        const isValid = difference < 0.01;
        const errors = isValid ? [] : ["Izračunani čisti poslovni izid se ne ujema z vnesenim."];

        res.json({ 
            valid: isValid, 
            errors: errors, 
            calculatedNetProfit: calculatedNetProfit.toFixed(2),
            declaredNetProfit: declaredNetProfit.toFixed(2),
            difference: difference.toFixed(2)
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
  getIncomeStatementByReportId,
  updateIncomeStatement,
  validateIncomeStatement,
};

