require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "postgres", // Replace with your DB username if needed
    password: process.env.DB_PASSWORD || "password", // Replace with your DB password
    database: process.env.DB_NAME || "accounting_dev", // Replace with your DB name
    host: process.env.DB_HOST || "127.0.0.1", // Replace with your DB host if needed
    dialect: "postgres",
    port: process.env.DB_PORT || 5432, // Default PostgreSQL port
  },
  test: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME_TEST || "accounting_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
    logging: false, // Disable logging for tests
  },
  production: {
    use_env_variable: "DATABASE_URL", // Use DATABASE_URL environment variable for production (e.g., on Heroku/Render)
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for some cloud providers
      },
    },
  },
};

