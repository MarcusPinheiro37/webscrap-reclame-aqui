require('dotenv').config(); // Load environment variables from .env file

const path = require('path');
const dbConfig = require(path.join(__dirname, './dbConfig.cjs')); // Import database configuration

// Export a configuration object that other parts of the application can use
module.exports = {
    db: dbConfig,
    // Additional configurations can go here
};