import mongoose from 'mongoose';
import { config } from '@config/config';
import { ConfigTypes } from '@appTypes/Config';

export const initializeDB = async (): Promise<typeof mongoose | null> => {
  try {
    const { databaseConfig } = config as ConfigTypes;

    if (!databaseConfig || !databaseConfig.uri) {
      throw new Error('Database URI not provided in configuration.');
    }

    const { uri } = databaseConfig;

    await mongoose.connect(uri);

    console.log(
      '===========================================================\n' +
        '                 Conexión a MongoDB Exitosa',
    );

    return mongoose;
  } catch (err) {
    console.error(
      '===========================================================\n' +
        '                Conexión a MongoDB Fallida\n' +
        '===========================================================\n' +
        `Error: ${err}`,
    );

    return null;
  }
};
