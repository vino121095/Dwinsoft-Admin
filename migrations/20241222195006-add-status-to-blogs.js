module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Blogs', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Draft',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Blogs', 'status');
  },
};
