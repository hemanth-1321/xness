import { Job } from 'bullmq';
import { db } from 'packages/db';

export const processPrice = async (job: Job) => {
  console.log('Processing price...', job.data);
  // const { symbol, price } = job.data;
  // await db.instrumentPrice.create({
  //   data: {
  //     symbol,
  //     price,
  //   },
  // });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('Price processed!');
  return { success: true };
};
