import express from 'express';
import path from 'path';
import billingRoutes from './routes/billingRoutes';
import { sequelize } from './config/config';
import { ConsumeActiveMerchants } from './services/activeMerchantConsumer';
import logger from './utils/logger';
import './models';

const app = express();
app.use(express.json());
app.use('/api/billing', billingRoutes); 
async function initialize() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established');
    
    await sequelize.sync({ alter: true });
    logger.info('Database synchronized');
    ConsumeActiveMerchants();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Initialization failed:', error);
    process.exit(1);
  }
}

initialize();

export default app;
