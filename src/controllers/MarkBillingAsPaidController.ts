import { Billing } from '../models/Billing';
import { ActiveMerchants } from '../models/Merchant';

interface RequestBody{
    Reference_Number: string
    user_id : string
}; 

export class MarkBillingAsPaidController {
  static async markAsPaid(req: RequestBody) {
    const reference_number  = req.Reference_Number;
    const payer = req.user_id;
 
    try {
      const billing = await Billing.findOne({ where: { reference_number } });

      if (!billing) {
        return {
                status: 'error',
                message: 'Billing not found',
                statusCode: 404 
            };
        }

      if (billing.status === 'PAYED') {
        return {
                status: 'error',
                message: 'Billing is already marked as PAYED',
                statusCode: 400 
            };
      }
          billing.status = 'PAYED';
          billing.paid_at = new Date();
          billing.payer_id = payer;
    
          await billing.save();        
          
          return {
              status: 'success',
              message: 'Billing marked as PAYED',
              reference_number: billing.reference_number,
              paid_at: billing.paid_at,
              statusCode : 201
            };
    } catch (err: any) {
      return {
        status: 'error',
        message: err.message || 'Server error',
        statusCode: 500
      };
    }
  }
}
