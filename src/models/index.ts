// src/models/index.ts
import { Sequelize } from 'sequelize';
import { sequelize } from '../config/config';

import { ActiveMerchants } from './Merchant';
import { Billing } from './Billing';

// Initialize models
ActiveMerchants.initialize(sequelize);

ActiveMerchants.associate?.();
