import { Billing } from '../models/Billing'
import { ActiveMerchants } from '../models/Merchant'

export class GetBillingByReferenceController {
    static async getBillingByReference(reference: string) {
        try {
            const billing = await Billing.findOne({ where: { reference_number: reference } });
            if (!billing) {
                return {
                    status: 'error',
                    message: 'Billing not found',
                    statusCode: 404 
                };
            }
            if (new Date(billing.expires_at) < new Date()) {
                return {
                    status: 'expired',
                    message: 'Billing has expired',
                    statusCode: 401
                }
            }
            const merchant = await ActiveMerchants.findOne({ 
                where: { merchant_id: billing?.merchant_id }
            });
            const fees = parseFloat((billing.amount * 0.0005).toFixed(2));
            const total = fees + billing.amount;
            const createdAtDate = new Date(billing.expires_at.getTime() - 3 * 24 * 60 * 60 * 1000);
            return {
                status: 'success',
                data: {
                  reference_number: billing.reference_number,
                  order_number: billing.order_number,
                  merchant: merchant?.commercial_name,
                  merchant_id: merchant?.merchant_id,
                  customer_name: billing.customer_name,
                  customer_mobile: billing.customer_mobile,
                  status : billing.status,
                  amount: billing.amount,
                  fee: fees,
                  total: total,
                  created_at: {
                    date: createdAtDate.toISOString().split('T')[0],
                    time: createdAtDate.toTimeString().split(' ')[0],
                  },
                  expires_at: {
                    date: new Date(billing.expires_at).toISOString().split('T')[0], 
                    time: new Date(billing.expires_at).toTimeString().split(' ')[0]
                  }
                },
                statusCode: 201 
              };              
        } catch (ex: any) {
            return {
                status: 'error',
                message: ex.message || 'An error occurred while fetching billing',
                statusCode: 500
            };
        }
    }
}