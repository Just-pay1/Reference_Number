import { Billing } from '../models/Billing'
import { ActiveMerchants } from '../models/Merchant'

export class GetBillingStatusController {
    static async getBillingByReference(reference: string) {
        try {
            const billing = await Billing.findOne({ where: { reference_number: reference } });
            if (!billing ) {
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
            return {
                status: 'success',
                billingStatus : billing.status,
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