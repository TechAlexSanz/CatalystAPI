import { Router } from 'express';
import { getAllRoles, getRoleByName } from './role.controller';

const router = Router();

router.get('/', getAllRoles);
router.get('/:name', getRoleByName);

export default router;
