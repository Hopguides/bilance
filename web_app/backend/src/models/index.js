"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/database.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Define associations here after all models are loaded

// User <-> Company (One-to-Many)
db.Company.hasMany(db.User, { foreignKey: "company_id" });
db.User.belongsTo(db.Company, { foreignKey: "company_id" });

// Company <-> AnnualReport (One-to-Many)
db.Company.hasMany(db.AnnualReport, { foreignKey: "company_id" });
db.AnnualReport.belongsTo(db.Company, { foreignKey: "company_id" });

// AnnualReport <-> Financial Statements (One-to-One)
db.AnnualReport.hasOne(db.BalanceSheet, { foreignKey: "annual_report_id" });
db.BalanceSheet.belongsTo(db.AnnualReport, { foreignKey: "annual_report_id" });

db.AnnualReport.hasOne(db.IncomeStatement, { foreignKey: "annual_report_id" });
db.IncomeStatement.belongsTo(db.AnnualReport, { foreignKey: "annual_report_id" });

db.AnnualReport.hasOne(db.CashFlowStatement, { foreignKey: "annual_report_id" });
db.CashFlowStatement.belongsTo(db.AnnualReport, { foreignKey: "annual_report_id" });

db.AnnualReport.hasOne(db.EquityStatement, { foreignKey: "annual_report_id" });
db.EquityStatement.belongsTo(db.AnnualReport, { foreignKey: "annual_report_id" });

// AnnualReport <-> Export (One-to-Many)
db.AnnualReport.hasMany(db.Export, { foreignKey: "annual_report_id" });
db.Export.belongsTo(db.AnnualReport, { foreignKey: "annual_report_id" });

// AnnualReport <-> Submission (One-to-Many)
db.AnnualReport.hasMany(db.Submission, { foreignKey: "annual_report_id" });
db.Submission.belongsTo(db.AnnualReport, { foreignKey: "annual_report_id" });

// User <-> AnnualReport (Updated By)
db.User.hasMany(db.AnnualReport, { foreignKey: "updated_by" });
db.AnnualReport.belongsTo(db.User, { foreignKey: "updated_by" });

// User <-> Export (Created By)
db.User.hasMany(db.Export, { foreignKey: "created_by" });
db.Export.belongsTo(db.User, { foreignKey: "created_by" });

// User <-> Submission (Submitted By)
db.User.hasMany(db.Submission, { foreignKey: "submitted_by" });
db.Submission.belongsTo(db.User, { foreignKey: "submitted_by" });

// Models for sprotno vodenje (if implemented)
// Company <-> BusinessEvent
// Company <-> FixedAsset
// Company <-> Inventory

module.exports = db;

