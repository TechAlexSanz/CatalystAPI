import { Router, Request, Response } from 'express';
import { config } from '@config/config';
import libraryRoutes from '@app/library';

const { port, url } = config;

const router = Router();

router.use('/library', libraryRoutes);

router.get('/', (_request: Request, response: Response) => {
  return response.status(200).json({
    message: 'Estás en la ruta /api',
    library: `${url}${port}/api/library`,
  });
});

export default router;
