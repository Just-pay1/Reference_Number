import { Billing } from '../models/Billing';
import { ActiveMerchants } from '../models/Merchant';
import { generateReferenceNumber } from '../utils/GenerateReferenceNumber';
import { getDateAfter3Days } from '../utils/getDateAfter3Days';
import logger from '../utils/logger';
import { sendEmailToQueue } from '../utils/SendMail';

interface BillingRequest {
    merchant_id: string;
    OrderId: string;
    customer_id: string;
    CustomerName: string;
    CustomerMobile: string;
    CustomerEmail: string;
    Amount: number;
}

export class CreateBillingController {
    static async CreateBilling(data: BillingRequest) {
        try {      
            const merchant = await ActiveMerchants.findOne({ 
                where: { merchant_id: data.merchant_id }
            });
            
            if (!merchant) {
                return {
                    status: 'error',
                    message: `Merchant with code ${data.merchant_id} not found`,
                    statusCode: 404  
                };
            }

            const billing = await Billing.create({
                reference_number: generateReferenceNumber(),
                order_number: data.OrderId,
                merchant_id: data.merchant_id,
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

            await sendEmailToQueue(data.CustomerEmail, billing.reference_number);
            return {
                status: 'success',
                "Reference Number": billing.reference_number,
                statusCode: 201  
            };

        } catch (ex: any) {
            logger.error('Billing creation error:', ex);

            return {
                status: 'error',
                message: ex.message || "An error occurred while creating billing",
                statusCode: 500
            };
        }
    }
}
