import express from 'express';
import { CreateBillingController } from '../controllers/CreateBillingController';
import { GetBillingByReferenceController } from '../controllers/getBillingByReferenceController';
import { validate } from '../middleware/validateCreateBilling.middleware';
import { CreateBillingSchema } from '../validators/billingValidator';
import { MarkBillingAsPaidController } from '../controllers/MarkBillingAsPaidController';

const router = express.Router();

router.get('/:reference', async (req, res) => {
  const result = await GetBillingByReferenceController.getBillingByReference(req.params.reference);
  res.status(result.statusCode || 200).json(result);
});

router.post('/', validate(CreateBillingSchema), async (req, res) => {
  const result = await CreateBillingController.CreateBilling(req.body);
  res.status(result.statusCode || 201).json(result);
});
router.post('/pay', async(req,res)=>{
    const result = await MarkBillingAsPaidController.markAsPaid(req.body);
    res.status(result.statusCode || 200).json(result);
});

export default router;
