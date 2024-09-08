import { Router } from 'express';
import { verifyAdminToken } from '@middlewares/auth';
import {
  getAllSections,
  getSectionById,
  getSectionByName,
  createSection,
  updateSection,
  deleteSection,
} from './section.controller';

const router = Router();

router.get('/', [verifyAdminToken], getAllSections);
router.get('/:id', [verifyAdminToken], getSectionById);
router.get('/name/:name', [verifyAdminToken], getSectionByName);
router.post('/', [verifyAdminToken], createSection);
router.put('/:id', [verifyAdminToken], updateSection);
router.delete('/:id', [verifyAdminToken], deleteSection);

export default router;
