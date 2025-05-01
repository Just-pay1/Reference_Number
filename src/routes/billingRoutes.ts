import express, { Router } from 'express';
import { GetBillingByReferenceController } from '../controllers/getBillingByReferenceController';
import { CreateBillingController } from '../controllers/CreateBillingConroller';
import { validateCreateBilling } from '../middlewares/validateCreateBilling.middleware';

const router = express.Router();

router.get('/:reference', async (req, res, next) => {
    try {
        const result = await GetBillingByReferenceController.getBillingByReference(req.params.reference);
       
        const statusCode = result.status === 'error' ? 404 : 
                         result.status === 'expired' ? 410 : 200;
        
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

router.post('/', validateCreateBilling, async (req, res, next) => {
    try {
        const result = await CreateBillingController.CreateBilling(req.body);
        res.status(result.status === 'error' ? 400 : 201).json(result);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

export default router;