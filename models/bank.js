'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bank = sequelize.define('Bank', {
    nama_bank: DataTypes.STRING,
    atas_nama: DataTypes.STRING,
    no_rek: DataTypes.STRING
  }, {});
  Bank.associate = function(models) {
    // associations can be defined here
  };
  return Bank;
};