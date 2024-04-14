// Environment variables are used here for sensitive information
const dbConfig = {
    development: {
        username: process.env.DB_USERNAME_DEV,
        password: process.env.DB_PASSWORD_DEV,
        database: process.env.DB_NAME_DEV,
        port: process.env.DB_PORT,
        host: process.env.DB_HOST_DEV,
        dialect: 'mysql', // or 'postgres', 'sqlite', etc., depending on your DB
        // Additional DB options like pool configuration could go here
    },
    production: {
        username: process.env.DB_USERNAME_PROD,
        password: process.env.DB_PASSWORD_PROD,
        database: process.env.DB_NAME_PROD,
        port: process.env.DB_PORT,
        host: process.env.DB_HOST_PROD,
        dialect: 'mysql',
        // Production-specific options here
    }
};
  
// You can add logic to automatically select the correct configuration
// based on the NODE_ENV environment variable
const environment = process.env.NODE_ENV || 'development';
const config = dbConfig[environment];
  
module.exports = config;
  