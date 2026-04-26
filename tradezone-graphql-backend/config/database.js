const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

sequelize.authenticate()
  .then(() => console.log('[PG] PostgreSQL connected'))
  .catch(err => console.warn('[PG] PostgreSQL unavailable, skipping:', err.message));

module.exports = sequelize;