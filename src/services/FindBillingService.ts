import { Billing } from '../models/Billing';
export class getBillingByReferenceService {

    static async getBillingByReference(reference: string) {
        try {
            const billing = await Billing.findOne({ where: { reference_number: reference } });
            if (!billing || billing.expires_at) {
                throw new Error('Billing not found');
            }
            return {
                status: 'success',
                data: billing,
            };
        } catch (error: any) {
            return {
                status: 'error',
                message: error.message || 'An error occurred while fetching billing',
            };
        }
    }
}