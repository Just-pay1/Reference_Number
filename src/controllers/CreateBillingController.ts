import { Billing } from '../models/Billing';
import { Merchant } from '../models/Merchant';
import { generateReferenceNumber } from '../utils/GenerateReferenceNumber';
import { getDateAfter3Days } from '../utils/getDateAfter3Days';

interface BillingRequest {
    MerchantCode: string;
    OrderId: string;
    customer_id: string;
    CustomerName: string;
    CustomerMobile: string;
    Amount: number;
}

export class CreateBillingController {
    static async CreateBilling(data: BillingRequest) {
        try {
            const merchant = await Merchant.findOne({ 
                where: { code: data.MerchantCode }
            });
            
            if (!merchant) {
                return {
                    status: 'error',
                    message: `Merchant with code ${data.MerchantCode} not found`,
                    statusCode: 404  
                };
            }

            const billing = await Billing.create({
                reference_number: generateReferenceNumber(),
                order_number: data.OrderId,
                merchant_code: data.MerchantCode,
                customer_id: data.customer_id,
                customer_name: data.CustomerName,
                customer_mobile: data.CustomerMobile,
                amount: data.Amount,
                status: 'PENDING',
                expires_at: getDateAfter3Days(),
                paid_at: null
            }, {
                validate: true
            });

            return {
                status: 'success',
                "Reference Number": billing.reference_number,
                statusCode: 201  
            };

        } catch (ex: any) {
            console.error('Billing creation error:', ex);

            return {
                status: 'error',
                message: ex.message || "An error occurred while creating billing",
                statusCode: 500
            };
        }
    }
}