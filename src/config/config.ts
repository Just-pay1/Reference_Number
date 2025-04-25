import { Sequelize } from 'sequelize';
require('dotenv').config();

export const sequelize = new Sequelize('Reverence_Number_Service', process.env.DB_USER!, process.env.DB_PASS!, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
});
