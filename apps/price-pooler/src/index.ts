import { Worker } from 'bullmq';
import { processPrice } from './worker';

const connection = {
  host: 'localhost',
  port: 6379,
};

const worker = new Worker('price-queue', processPrice, { connection });

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed with error ${err.message}`);
});

console.log('Price pooler running...');