import { Router } from 'express';
import { getAllCategories, createCategory } from './category.controller';

const router = Router();

router.get('/', getAllCategories);
router.post('/', createCategory);

export default router;
