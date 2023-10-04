'use strict';
const bcrypt = require('bcrypt')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const password = bcrypt.hashSync('rahasia', 10);
    return queryInterface.bulkInsert('Users', [
      {
        name: 'superadmin',
        username: 'superadmin',
        password: password,
        role: 'super_admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'admin',
        username: 'admin',
        password: password,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'keuangan',
        username: 'keuangan',
        password: password,
        role: 'keuangan',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'kasir',
        username: 'kasir',
        password: password,
        role: 'kasir',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'dokter',
        username: 'dokter',
        password: password,
        role: 'paramedis',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'paramedik',
        username: 'paramedik',
        password: password,
        role: 'paramedis',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'farmasi',
        username: 'farmasi',
        password: password,
        role: 'farmasi',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    , {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
