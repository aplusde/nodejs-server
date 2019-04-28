'use strict';
module.exports = (sequelize, DataTypes) => {
  const variogram = sequelize.define('variogram', {
    nugget: DataTypes.DECIMAL,
    sill: DataTypes.DECIMAL,
    range: DataTypes.DECIMAL
  }, {});
  variogram.associate = function(models) {
    // associations can be defined here
  };
  return variogram;
};