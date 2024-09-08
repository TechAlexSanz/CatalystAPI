import { Router } from 'express';
import upload from '@middlewares/multer';
import {
  getAllBooks,
  getBookById,
  getActiveBooks,
  getBooksByCategory,
  createBook,
  updateBook,
  updateCoverImage,
  deleteBook,
  restoreBook,
  disableBook,
} from './book.controller';

const router = Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/actives', getActiveBooks);
router.post('/category/:id', getBooksByCategory);
router.post('/', upload.single('coverImage'), createBook);
router.put('/:id', upload.single('coverImage'), updateBook);
router.patch('/restore/:id', restoreBook);
router.patch('/disable/:id', disableBook);
router.patch('/cover-image/:id', upload.single('coverImage'), updateCoverImage);
router.delete('/:id', deleteBook);

export default router;
