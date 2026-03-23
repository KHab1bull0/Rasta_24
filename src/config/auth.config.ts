import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME,
}));
