import { Request, Response, Router } from 'express';
import { config } from '@config/config';
import bookRoutes from './Books/book.routes';
import categoryRoutes from './Categories/category.routes';
import LoanRoutes from './Loans/loan.routes';
import sectionRoutes from './Sections/section.routes';
import studentRoutes from './Students/student.routes';
import subSectionRoutes from './SubSections/subsection.routes';
import userRoutes from './Users/user.routes';
import roleRoutes from './Roles/role.routes';
import dashboardRoutes from './Dashboard/dashboard.routes';

const router = Router();

const { port, url } = config;

router.use('/books', bookRoutes);
router.use('/categories', categoryRoutes);
router.use('/loans', LoanRoutes);
router.use('/sections', sectionRoutes);
router.use('/students', studentRoutes);
router.use('/subsections', subSectionRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/', (_request: Request, response: Response) => {
  return response.status(200).json({
    Books: `${url}${port}/api/library/books`,
    Categories: `${url}${port}/api/library/categories`,
    Loans: `${url}${port}/api/library/loans`,
    Sections: `${url}${port}/api/library/sections`,
    Students: `${url}${port}/api/library/students`,
    SubSections: `${url}${port}/api/library/subsections`,
    Users: `${url}${port}/api/library/users`,
    Roles: `${url}${port}/api/library/roles`,
    Dashboard: `${url}${port}/api/library/dashboard`,
  });
});

export default router;
