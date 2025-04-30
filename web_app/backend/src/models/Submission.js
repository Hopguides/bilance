"use strict";

module.exports = (sequelize, DataTypes) => {
  const Submission = sequelize.define(
    "Submission",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      annual_report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "AnnualReports",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      submission_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM("pending", "success", "failed"),
        allowNull: false,
      },
      ajpes_response: {
        type: DataTypes.TEXT, // Store response from AJPES API
        allowNull: true,
      },
      submitted_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // Keep submission record even if user is deleted
      },
    },
    {
      timestamps: true, // Enable createdAt and updatedAt fields
      underscored: true, // Use snake_case for column names
    }
  );

  Submission.associate = (models) => {
    // Associations defined in models/index.js
  };

  return Submission;
};

