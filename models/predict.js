'use strict';
module.exports = (sequelize, DataTypes) => {
  const predict = sequelize.define('predict', {
    zpredict: DataTypes.DECIMAL,
    estimation: DataTypes.DECIMAL,
    predictError: DataTypes.DECIMAL
  }, {});
  predict.associate = function(models) {
    // associations can be defined here
  };
  return predict;
};