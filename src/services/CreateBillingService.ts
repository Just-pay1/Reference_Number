import { Billing } from '../models/Billing';
import { Merchant } from '../models/Merchant';
import { generateReferenceNumber} from '../utils/GenerateReferenceNumber';
import {  getDateAfter3Days } from '../utils/getDateAfter3Days'



interface BillingRequest {
  merchantCode: string;
  customerName: string;
  customerMobile: string;
  amount: number;
  orderId: string;
  description: string;
}

export class createBillingService {
  
  static async createBilling(data: BillingRequest) {
    try {
      const merchant = await Merchant.findOne({ where: { code: data.merchantCode } });
      if (!merchant) {
        throw new Error('Merchant not found');
      }
      
      const reference = generateReferenceNumber(); 
      const expiresAt = getDateAfter3Days();
      
      const billing = await Billing.create({
        reference_number: reference,         // a unique reference number
        order_number: data.orderId,          // from req
        merchant_code: data.merchantCode,    // from req
        customer_name: data.customerName,    // from req
        customer_mobile: data.customerMobile,// from req
        amount: data.amount,                 // from req
        status: 'PENDING',                   // Initialy
        expires_at: expiresAt,               // Set expiration to 3 days from now
        paid_at: null,                       // Initially
      });
      /// save the billing in the db and reurn the reference number 
      return {
        status: 'success',
        data: reference,
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'An error occurred while creating billing',
      };
    }
  }


}
