import amqplib from 'amqplib';
import { ActiveMerchants } from '../models/Merchant';
import { sequelize } from '../config/config';
import { merchantSchema } from '../validators/ActiveMerchantValidation';
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
          const { error, value } = merchantSchema.validate(merchantData, { abortEarly: false });
          if (error) {
            console.error('Invalid merchant data:', error.details.map(d => d.message).join(', '));
            channel.nack(msg, false, false); 
            return;
          }
          const existing = await ActiveMerchants.findOne({
            where: { merchant_id: value.merchant_id }
          })
          if (!existing) {
            await ActiveMerchants.create(value);
            console.log(`Inserted merchant ${value.merchant_id}`);
          } else {
            console.log(`Merchant ${value.merchant_id} already exists. Skipping...`);
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



