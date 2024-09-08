import { Request, Response } from 'express';
import bookModel from '../Books/book.model';
import sectionModel from '../Sections/section.model';
import studentModel from '../Students/student.model';
import subsectionModel from '../SubSections/subsection.model';

export const dashboard = async (
  _request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const totalBooks = await bookModel.find().countDocuments();
    const totalStudents = await studentModel.find().countDocuments();
    const totalSections = await sectionModel.find().countDocuments();
    const totalSubSections = await subsectionModel.find().countDocuments();

    return response.status(200).json({
      code: 200,
      success: true,
      data: {
        totalBooks,
        totalStudents,
        totalSections,
        totalSubSections,
      },
    });
  } catch (err) {
    console.error(err);

    return response.status(500).json({
      error: 'Error interno del servidor',
      code: 500,
      success: false,
    });
  }
};
