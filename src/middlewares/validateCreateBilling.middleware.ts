import { Request, Response, NextFunction } from 'express';

export const validateCreateBilling = (req: Request, res: Response, next: NextFunction) => {
  const {
    MerchantCode,
    OrderId,
    CustomerName,
    CustomerMobile,
    Amount,
  } = req.body;

  const errors: string[] = [];

  if (!MerchantCode || typeof MerchantCode !== 'string') {
    errors.push('Invalid or missing MerchantCode');
  }

  if (!CustomerName || typeof CustomerName !== 'string') {
    errors.push('Invalid or missing CustomerName');
  }

  if (!CustomerMobile || typeof CustomerMobile !== 'string') {
    errors.push('Invalid or missing CustomerMobile');
  } else if (!/^\d+$/.test(CustomerMobile)) {
    errors.push('CustomerMobile should contain only numbers');
  }

  if (typeof Amount !== 'number' || Amount <= 0) {
    errors.push('Amount must be a positive number');
  }

  if (errors.length > 0) {
    res.status(400).json({ 
      status: 'error',
      message: 'Validation failed',
      errors 
    });
    return; 
  }

  next(); 
};