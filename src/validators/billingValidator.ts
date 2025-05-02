import Joi from "joi";

export const CreateBillingSchema = Joi.object({
    MerchantCode: Joi.string().required(),
    OrderId: Joi.string().required(),
    customer_id: Joi.string().optional(),
    CustomerName: Joi.string().required(),
    CustomerMobile: Joi.string().required(),
    Amount: Joi.number().positive().required()
});