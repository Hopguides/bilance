const { Company, User } = require("../models"); // Adjust path as needed
const { Op } = require("sequelize");

// @desc    Get the company associated with the logged-in user
// @route   GET /api/companies/mine
// @access  Private
const getMyCompany = async (req, res, next) => {
  try {
    // req.user is set by the authMiddleware
    const user = await User.findByPk(req.user.id);
    if (!user || !user.company_id) {
      return res.status(404).json({ message: "Podjetje ni povezano s tem uporabnikom." });
    }

    const company = await Company.findByPk(user.company_id);

    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ message: "Podjetje ni najdeno." });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update company details
// @route   PUT /api/companies/:id
// @access  Private (potentially restricted to admin or specific user roles)
const updateCompany = async (req, res, next) => {
  const { id } = req.params;
  const { name, registration_number, tax_number, address, city, postal_code, size } = req.body;

  try {
    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: "Podjetje ni najdeno." });
    }

    // Authorization check: Ensure the logged-in user is allowed to update this company
    // Example: Only allow users associated with this company or admins
    if (req.user.company_id !== company.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Nimate dovoljenja za posodobitev tega podjetja." });
    }

    // Check for uniqueness constraints if registration_number or tax_number are changed
    if (registration_number && registration_number !== company.registration_number) {
        const existingReg = await Company.findOne({ where: { registration_number, id: { [Op.ne]: id } } });
        if (existingReg) {
            return res.status(400).json({ message: "Podjetje s to matično številko že obstaja." });
        }
    }
    if (tax_number && tax_number !== company.tax_number) {
        const existingTax = await Company.findOne({ where: { tax_number, id: { [Op.ne]: id } } });
        if (existingTax) {
            return res.status(400).json({ message: "Podjetje s to davčno številko že obstaja." });
        }
    }

    // Update fields
    company.name = name || company.name;
    company.registration_number = registration_number || company.registration_number;
    company.tax_number = tax_number || company.tax_number;
    company.address = address || company.address;
    company.city = city || company.city;
    company.postal_code = postal_code || company.postal_code;
    company.size = size || company.size;

    await company.save();

    res.json(company);
  } catch (error) {
    next(error);
  }
};

// Add other company-related controller functions if needed (e.g., get all companies for admin)

module.exports = {
  getMyCompany,
  updateCompany,
};

