import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const MAILS_QUEUE = process.env.MAILS_QUEUE || 'mailQueue';

/**
 * Sends an email notification message with a reference number to RabbitMQ.
 * @param email Recipient email address
 * @param referenceNumber Reference number to send
 */
export async function sendEmailToQueue(email: string, referenceNumber: string) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Still safe even if the queue already exists
    await channel.assertQueue(MAILS_QUEUE, { durable: true });

    const message = {
      from: 'justpay@gmail.com',
      to: email,
      subject: 'JustPay - Reference Number',
      content: `Your reference number is ${referenceNumber}.`
    };

    channel.sendToQueue(MAILS_QUEUE, Buffer.from(JSON.stringify(message)), {
      persistent: true
    });

    console.log(`Message for ${email} sent to queue`);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Failed to send message to RabbitMQ:', error);
  }
}


