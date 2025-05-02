import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        details: error.details.map(d => d.message)
      });
      return; 
    }

    next(); 
  };
};
