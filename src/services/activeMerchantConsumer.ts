import amqplib from 'amqplib';
import { ActiveMerchants } from '../models/Merchant';
import { sequelize } from '../config/config';
import dotenv from 'dotenv';

dotenv.config();

const QUEUE_NAME = process.env.QUEUE_NAME;
const RABBITMQ_URL = process.env.RABBITMQ_URL;


async function consumeActiveMerchantsQueue() {
    try {
        const connection = await amqplib.connect(RABBITMQ_URL!);
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME!, { durable: true });

        channel.consume(QUEUE_NAME!, async (msg) => {
            if (msg !== null) {
                try {
                    const content = msg.content.toString();
                    const merchantData = JSON.parse(content);

                    console.log('Received:', merchantData);

                    if (Array.isArray(merchantData)) {
                        await ActiveMerchants.bulkCreate(merchantData, {
                          updateOnDuplicate: [
                            'legal_name',
                            'commercial_name',
                            'address',
                            'commercial_reg_number',
                            'license_issue_date',
                            'license_exp_date',
                            'tax_id_number',
                            'telephone_number',
                            'admin_email',
                            'business_type',
                            'bank_name',
                            'account_holder_name',
                            'account_type',
                            'account_number',
                            'iban',
                            'swift',
                            'settlement_time',
                            'settlement_period',
                            'commission_setup',
                            'commission_amount',
                            'longitude',
                            'latitude',
                            'fee_from'
                          ]
                        });
                      } else {
                        await ActiveMerchants.upsert(merchantData);
                      }
                    channel.ack(msg);
                } catch (err) {
                    console.error('Error processing message:', err);
                    channel.nack(msg);
                }
            }
        });
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
}
export async function ConsumeActiveMerchants() {
  try {
    await consumeActiveMerchantsQueue();
    console.log('RabbitMQ consumer running');
  } catch (err) {
    console.error('RabbitMQ consumer failed to start:', err);
  }
}



