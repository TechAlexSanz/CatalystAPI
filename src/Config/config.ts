import 'dotenv/config';
import { ConfigTypes } from '@appTypes/Config';

const validateEnvVariable = (
  variable: string,
  defaultValue: string | number,
): string | number => {
  if (!process.env[variable]) {
    console.warn(
      `La variable de entorno ${variable} no está definida. Se utilizará el valor predeterminado: ${defaultValue}`,
    );
    return defaultValue;
  }
  return process.env[variable]!;
};

export const config: ConfigTypes = {
  port: validateEnvVariable('PORT', 3000) as number,
  url: validateEnvVariable('URL', 'http://localhost:') as string,
  whiteList: process.env.CORS_WHITELIST
    ? process.env.CORS_WHITELIST.split(',')
    : [],
  databaseConfig: {
    uri: validateEnvVariable('MONGODB_URI', '') as string,
  },
  jwtOptions: {
    tokenSecret: validateEnvVariable('JWT_SECRET', '') as string,
  },
  cloudinaryConfig: {
    cloudName: validateEnvVariable('CLOUDINARY_CLOUD_NAME', '') as string,
    apiKey: validateEnvVariable('CLOUDINARY_API_KEY', '') as string,
    apiSecret: validateEnvVariable('CLOUDINARY_API_SECRET', '') as string,
  },
  roles: process.env.ROLES ? process.env.ROLES.split(',') : [],
  adminCredentials: {
    code: validateEnvVariable('ADMIN_CODE', '') as number,
    password: validateEnvVariable('ADMIN_PASSWORD', '') as string,
  },
};
