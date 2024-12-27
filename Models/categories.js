const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const Category = sequelize.define("category", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  category_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},
  {
    hooks: {
      beforeCreate: async (instance, options) => {
        // Get the latest record to determine the next sequence value
        const latestRecord = await Category.findOne({
          order: [['id', 'DESC']],
        });

        // Determine the next sequence value
        const nextSequence = latestRecord ? latestRecord.id + 1 : 1;

        // Generate custom ID based on sequential order
        instance.category_id = `CAT${String(nextSequence).padStart(3, '0')}`;
      },
    },
  }
);

Category.sync();

module.exports = Category