const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Company } = require("../models"); // Adjust path as needed

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  const { username, email, password, company_name, registration_number, tax_number, size } = req.body;

  // Basic validation
  if (!username || !email || !password || !company_name || !registration_number || !tax_number || !size) {
    return res.status(400).json({ message: "Prosimo, izpolnite vsa polja." });
  }

  const transaction = await User.sequelize.transaction();

  try {
    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      await transaction.rollback();
      return res.status(400).json({ message: "Uporabnik s tem emailom že obstaja." });
    }

    // Check if company exists by registration or tax number
    let company = await Company.findOne({
      where: {
        [User.sequelize.Op.or]: [
          { registration_number: registration_number },
          { tax_number: tax_number },
        ],
      },
    });

    if (!company) {
      // Create company if it doesn't exist
      company = await Company.create({
        name: company_name,
        registration_number,
        tax_number,
        size,
        // Add other company fields if provided
      }, { transaction });
    } else {
      // Optionally update company info if it exists, or just use the existing one
      // For simplicity, we'll use the existing one
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password, // Hashing is done by the model hook
      company_id: company.id,
      role: "user", // Default role, adjust if needed
    }, { transaction });

    await transaction.commit();

    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        companyId: user.company_id,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Neveljavni uporabniški podatki." });
    }
  } catch (error) {
    await transaction.rollback();
    next(error); // Pass error to the error handler
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Prosimo, vnesite email in geslo." });
  }

  try {
    // Check for user by email
    const user = await User.findOne({ where: { email } });

    if (user && (await user.isValidPassword(password))) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        companyId: user.company_id,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Neveljaven email ali geslo." });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    // req.user is set by the authMiddleware
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] }, // Exclude password hash
      include: { model: Company } // Include associated company details
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "Uporabnik ni najden." });
    }
  } catch (error) {
    next(error);
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your_jwt_secret", {
    expiresIn: "30d", // Token expiration time
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};

