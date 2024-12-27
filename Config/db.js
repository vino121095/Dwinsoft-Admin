const { Sequelize } = require('sequelize');  // Use destructuring to import Sequelize

const sequelize = new Sequelize('dwinsoft', 'root', 'pass12345', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,  // Port should be a number, not a string
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

module.exports = sequelize;
