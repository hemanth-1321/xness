import { Worker } from 'bullmq';
import { redis } from 'packages/redis';
import { fetchAndPool } from './worker';

const connection = {
  host: redis.options.host,
  port: redis.options.port,
  username: redis.options.username,
  password: redis.options.password,
};

const worker = new Worker('price-pooling-queue', async (job) => {
  console.log(`Processing job ${job.id} with data ${JSON.stringify(job.data)}`);
  await fetchAndPool(job.data.instrumentId);
}, { connection });


worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error ${err.message}`);
});

console.log('Price pooler worker started');
