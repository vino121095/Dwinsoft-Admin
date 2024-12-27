'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Blog.init({
    title: DataTypes.STRING,
    short_desc: DataTypes.STRING,
    description: DataTypes.TEXT,
    category: DataTypes.JSON,
    banner_image_url: DataTypes.STRING,
    description_image_url: DataTypes.STRING,  // Add this line
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Blog',
  });

  return Blog;
};
