import amqplib from 'amqplib';
import { ActiveMerchants } from '../models/Merchant';
import { sequelize } from '../config/config';
import { merchantSchema } from '../validators/ActiveMerchantValidation';
import dotenv from 'dotenv';
import logger from '../utils/logger';

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

          logger.info(`Received: ${JSON.stringify(merchantData)}`);
          const { error, value } = merchantSchema.validate(merchantData, { abortEarly: false });
          if (error) {
            logger.error(`Invalid merchant data: ${error.details.map(d => d.message).join(', ')}`);
            channel.nack(msg, false, false); 
            return;
          }
          const existing = await ActiveMerchants.findOne({
            where: { merchant_id: value.merchant_id }
          })
          if (!existing) {
            await ActiveMerchants.create(value);
            logger.info(`Inserted merchant ${value.merchant_id}`);
          } else {
            logger.info(`Merchant ${value.merchant_id} already exists. Skipping...`);
          }
          channel.ack(msg);
        } catch (err) {
          logger.error('Error processing message:', err);
          channel.nack(msg);
        }
      }
    });
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ:', error);
  }
}
export async function ConsumeActiveMerchants() {
  try {
    await consumeActiveMerchantsQueue();
    logger.info('RabbitMQ consumer running');
  } catch (err) {
    logger.error('RabbitMQ consumer failed to start:', err);
  }
}



