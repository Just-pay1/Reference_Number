import { Sequelize } from 'sequelize';
import * as fs from 'fs';
require('dotenv').config();

export const sequelize = new Sequelize('ref-num-db', process.env.DB_USER!, process.env.DB_PASS!, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true
    }
  }
});
