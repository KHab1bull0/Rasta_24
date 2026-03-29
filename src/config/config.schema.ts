import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // app
  APP_MODE: Joi.string().valid('dev', 'test', 'prod'),
  PORT: Joi.number(),

  // database
  DATABASE_URL: Joi.string().uri(),

  // auth
  JWT_SECRET: Joi.string(),
  JWT_EXPIRATION_TIME: Joi.string(),
  JWT_REFRESH_SECRET: Joi.string(),
  JWT_REFRESH_EXPIRATION_TIME: Joi.string(),

  //   // Cloudflare
  //   CLOUDFLARE_BUCKET_NAME: Joi.string(),
  //   CLOUDFLARE_ACCOUNT_ID: Joi.string(),
  //   CLOUDFLARE_ACCESS_KEY: Joi.string(),
  //   CLOUDFLARE_SECRET_KEY: Joi.string(),
});
