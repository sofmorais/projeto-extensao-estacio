const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Produto = sequelize.define('Produto', {
  nome: { type: DataTypes.STRING, allowNull: false },
  qtd: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
});

module.exports = Produto;
