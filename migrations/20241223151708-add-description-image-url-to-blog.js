module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Blogs', 'description_image_url', {
      type: Sequelize.STRING,
      allowNull: true,  // Allow NULL if image is not provided
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Blogs', 'description_image_url');
  },
};
