// src/routes/billingRoutes.ts
import express from 'express';
import { GetBillingByReferenceController } from '../controllers/getBillingByReferenceController';
import { CreateBillingController } from '../controllers/CreateBillingConroller';

const router = express.Router();

router.get('/:reference', async (req, res) => {
    try {
        const result = await GetBillingByReferenceController.getBillingByReference(req.params.reference);
        
        // Set appropriate status code based on result
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

// Create new billing
router.post('/', async (req, res) => {
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