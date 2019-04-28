'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('predicts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nodeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Nodes',
          key: 'id',
        }
      },
      varioId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'variograms',
          key: 'id',
        }
      },
      zpredict: {
        type: Sequelize.DECIMAL(20, 10)
      },
      estimation: {
        type: Sequelize.DECIMAL(20, 10)
      },
      predictError: {
        type: Sequelize.DECIMAL(20, 10)
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
    return queryInterface.dropTable('predicts');
  }
};