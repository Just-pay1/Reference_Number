// src/models/index.ts
import { Merchant } from './Merchant';
import { Billing } from './Billing';

// Call associate for each model (if any)
Billing.associate?.();

export { Merchant, Billing };
