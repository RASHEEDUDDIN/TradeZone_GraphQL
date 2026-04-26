require('dotenv').config({ path: __dirname + '/../.env' });
const sequelize = require('../config/database');
const TransactionPG = require('../src/models/TransactionPG');

async function runMigration() {
  if (!sequelize || !TransactionPG) {
    console.log('PostgreSQL not configured, skipping migration.');
    return process.exit(0);
  }

  try {
    await sequelize.authenticate();
    await TransactionPG.sync({ alter: true });
    console.log('Successfully created/updated transactions table in PostgreSQL');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = runMigration;
