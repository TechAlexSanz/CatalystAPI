import { Router } from 'express';
import { dashboard } from './dashboard.controller';

const router = Router();

router.get('/', dashboard);

export default router;
