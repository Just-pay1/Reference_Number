import express from 'express';
// import CreateReferenceNumberRoute from './routes/CreateReferenceNumberRoute' 
import { sequelize } from './config/config';
import './models';

const app = express();
app.use(express.json());
// app.use('/api', CreateReferenceNumberRoute);

sequelize.sync({ force: true }) 
  .then(() => {
    console.log('Database is created successfully!');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

export default app;