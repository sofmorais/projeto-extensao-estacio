const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database'); // ajuste o caminho para sua conexão sequelize

class Log extends Model {}

Log.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  data: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  produto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  acao: {
    type: DataTypes.ENUM('Adicionado', 'Removido', 'Excluído'),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Log',
  tableName: 'logs',
  timestamps: true,
});

module.exports = Log;
