import express, { Application, Router, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { initializeDB } from '@database/database';
import { config } from '@config/config';
import { corsOptions } from '@utils/corsOptions';
import { setRoles, SetAdmin } from '@src/Libs';

const app: Application = express();
const { port, url } = config;

export const initializeServer = async (apiRoutes: Router) => {
  try {
    if (!port || !url) {
      throw new Error('Port or URL not provided in configuration.');
    }

    await initializeDB();

    await setRoles();
    await SetAdmin();

    app.set('port', port);

    app.use(express.json());
    app.use(cors(corsOptions));
    app.use(morgan('dev'));

    app.listen(port, () => {
      console.log(
        '===========================================================\n' +
          '                Server listening and running\n' +
          '===========================================================\n' +
          `Access the server at: ${url}${port}\n` +
          '===========================================================',
      );
    });

    app.use('/api', apiRoutes);

    app.get('/', (_request: Request, response: Response) => {
      return response.status(200).json({
        message: 'Welcome to the API',
        api: `${url}${port}/api`,
      });
    });
  } catch (err) {
    console.error(
      '===========================================================\n' +
        '                Could not start the server\n' +
        '===========================================================\n' +
        `Error: ${err}`,
    );

    process.exit(1);
  }
};

export default app;
