import { registerAs } from '@nestjs/config';

export default registerAs('cloudflare', () => ({
  bucketName: process.env.CLOUDFLARE_BUCKET_NAME,
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  accessKey: process.env.CLOUDFLARE_ACCESS_KEY,
  secretKey: process.env.CLOUDFLARE_SECRET_KEY,
}));
