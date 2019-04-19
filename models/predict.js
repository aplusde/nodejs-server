'use strict';
module.exports = (sequelize, DataTypes) => {
  const predict = sequelize.define('predict', {
    varioId: DataTypes.INTEGER.UNSIGNED,
    zpredict: DataTypes.DECIMAL,
    estimation: DataTypes.DECIMAL,
    predictError: DataTypes.DECIMAL
  }, {});
  predict.associate = function(models) {
    // associations can be defined here
  };
  return predict;
};