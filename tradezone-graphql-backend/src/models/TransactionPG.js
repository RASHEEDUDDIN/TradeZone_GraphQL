const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

let TransactionPG = null;

if (sequelize) {
  TransactionPG = sequelize.define('Transaction', {
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    items: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'completed'
    }
  }, {
    tableName: 'transactions',
    timestamps: true
  });
}

module.exports = TransactionPG;
