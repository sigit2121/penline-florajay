'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Banks', [
      {
        nama_bank: 'Mandiri',
        atas_nama: 'Elfin Sanjaya',
        no_rek:'114009009',
      }
    ]
    , {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Banks', null, {});
  }
};
