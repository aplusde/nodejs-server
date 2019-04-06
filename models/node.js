'use strict';
module.exports = (sequelize, DataTypes) => {
  const Node = sequelize.define('Node', {
    latitude: DataTypes.DECIMAL,
    longtitude: DataTypes.DECIMAL,
    attitude: DataTypes.DECIMAL
  }, {});
  Node.associate = function(models) {
    // associations can be defined here
  };
  return Node;
};