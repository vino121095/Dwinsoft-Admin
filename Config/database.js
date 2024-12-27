const fs = require('fs');
require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL || '',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      }
    }
  },
  test: {
    url: process.env.TEST_DATABASE_URL || '',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      }
    }
  },
  production: {
    url: process.env.DATABASE_URL || '',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false, 
        require: true
      }
    }
  },
};