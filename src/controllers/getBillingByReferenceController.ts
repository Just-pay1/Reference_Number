import { Billing } from '../models/Billing'
import { Merchant } from '../models/Merchant'

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
            const merchant = await Merchant.findOne({ 
                where: { code: billing?.merchant_code }
            });
            return {
                status: 'success',
                Billing: {
                  reference_number: billing.reference_number,
                  order_number: billing.order_number,
                  merchant: merchant?.name,
                  customer_name: billing.customer_name,
                  customer_mobile: billing.customer_mobile,
                  amount: billing.amount,
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