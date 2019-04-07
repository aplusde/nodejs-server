'use strict';
module.exports = (sequelize, DataTypes) => {
  const range = sequelize.define('range', {
    range: DataTypes.DECIMAL,
    nodeId: DataTypes.INTEGER.UNSIGNED,
    rangeFromNode: DataTypes.DECIMAL
  }, {});
  range.associate = function (models) {
    // associations can be defined here
  };
  return range;
};