import express from 'express';
import billingRoutes from './routes/billingRoutes';
import { sequelize } from './config/config';
import { ConsumeActiveMerchants } from './services/activeMerchantConsumer';
import './models';

const app = express();
app.use(express.json());
async function initialize() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
    ConsumeActiveMerchants();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Initialization failed:', error);
    process.exit(1);
  }
}

initialize();

export default app;