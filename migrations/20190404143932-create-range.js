'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ranges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nodeId:{
        type: Sequelize.INTEGER,
        references:{
          model: 'Nodes',
          key:'id',
        }
      },
      range: {
        type: Sequelize.DECIMAL(20,10)
      },
      rangeFromNode: {
        type: Sequelize.DECIMAL(20,10)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ranges');
  }
};