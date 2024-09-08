import { Request, Response } from 'express';
import mongoose from 'mongoose';
import loanModel from './loan.model';
import bookModel from '../Books/book.model';
import studentModel from '../Students/student.model';

export const getAllLoansByStudentId = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { id } = request.params;

  try {
    const confirmedLoans = await loanModel
      .find({
        isConfirmed: true,
        isReturned: false,
        isRejected: false,
        isCancelled: false,
        student: id,
      })
      .populate(['book', 'student']);

    const pendingLoans = await loanModel
      .find({
        isConfirmed: false,
        isReturned: false,
        isRejected: false,
        isCancelled: false,
        student: id,
      })
      .populate(['book', 'student']);

    const rejectedLoans = await loanModel
      .find({
        isConfirmed: false,
        isReturned: false,
        isRejected: true,
        isCancelled: false,
        student: id,
      })
      .populate(['book', 'student']);

    const returnedLoans = await loanModel
      .find({
        isConfirmed: true,
        isReturned: true,
        isRejected: false,
        isCancelled: false,
        student: id,
      })
      .populate(['book', 'student']);

    const cancelledLoans = await loanModel
      .find({
        isConfirmed: false,
        isReturned: false,
        isRejected: false,
        isCancelled: true,
        student: id,
      })
      .populate(['book', 'student']);

    return response.status(200).json({
      code: 200,
      success: true,
      data: {
        confirmed: confirmedLoans,
        pending: pendingLoans,
        rejected: rejectedLoans,
        returned: returnedLoans,
        cancelled: cancelledLoans,
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

export const getAllPendingLoans = async (
  _request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const pendingLoans = await loanModel
      .find({
        isConfirmed: false,
        isReturned: false,
        isRejected: false,
        isCancelled: false,
      })
      .populate(['book', 'student']);

    return response.status(200).json({
      code: 200,
      success: true,
      data: {
        pending: pendingLoans,
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

export const getLoansByStudent = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { student } = request.params;

  if (!student) {
    return response.status(400).json({
      error: 'Por favor, complete todos los campos obligatorios del formulario',
      code: 400,
      success: false,
    });
  }

  const studentExists = await studentModel.findOne({ id: student });

  if (!studentExists) {
    return response.status(409).json({
      error: 'El estudiante no existe en la base de datos',
      code: 409,
      success: false,
    });
  }

  const loans = await loanModel
    .find({ student })
    .populate(['books', 'students']);

  if (!loans) {
    return response.status(404).json({
      error: 'El estudiante no tiene préstamos registrados en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    return response.status(200).json({
      message: 'Préstamos encontrados!',
      code: 200,
      success: true,
      data: loans,
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

export const getLoanById = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: 'El formato del ID ingresado es inválido',
      code: 400,
      success: false,
    });
  }

  const loan = await loanModel.findById(id).populate(['books', 'students']);

  if (!loan) {
    return response.status(404).json({
      error: 'El préstamo no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    return response.status(200).json({
      message: 'Préstamo encontrado!',
      code: 200,
      success: true,
      data: loan,
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

export const createLoan = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { book, student, quantity, loanDate, expectReturnDate } = request.body;

  if (!book || !student || !quantity || !loanDate || !expectReturnDate) {
    return response.status(400).json({
      error: 'Por favor, complete todos los campos obligatorios del formulario',
      code: 400,
      success: false,
    });
  }

  const bookExists = await bookModel.findOne({ id: book._id });

  if (!bookExists) {
    return response.status(409).json({
      error: 'El libro no existe en la base de datos',
      code: 409,
      success: false,
    });
  }

  try {
    const bookCreated = await loanModel.create({
      book,
      student,
      quantity,
      loanDate,
      expectReturnDate,
      isConfirmed: false,
      isReturned: false,
      isRejected: false,
      isCancelled: false,
    });

    return response.status(201).json({
      message: 'Préstamo creado a la espera de confirmación!',
      code: 201,
      success: true,
      data: bookCreated,
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

export const confirmLoan = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { id } = request.params;
  const { returnDate } = request.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: 'El formato del ID ingresado es inválido',
      code: 400,
      success: false,
    });
  }

  const loan = await loanModel.findById(id);

  if (!loan) {
    return response.status(404).json({
      error: 'El préstamo no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    const book = await bookModel.findById(loan.book);
    if (!book) {
      return response.status(404).json({
        error: 'El libro no existe en la base de datos',
        code: 404,
        success: false,
      });
    }

    if (book.quantity < loan.quantity) {
      return response.status(400).json({
        error: 'No hay suficiente cantidad del libro disponible',
        code: 400,
        success: false,
      });
    }

    book.quantity -= loan.quantity;
    await book.save();

    if (returnDate) {
      await loanModel.findByIdAndUpdate(id, {
        returnDate,
        isConfirmed: true,
        isReturned: false,
        isRejected: false,
        isCancelled: false,
      });
    }

    await loanModel.findByIdAndUpdate(id, {
      isConfirmed: true,
      isReturned: false,
      isRejected: false,
      isCancelled: false,
    });

    return response.status(200).json({
      message: 'Préstamo confirmado exitosamente!',
      code: 200,
      success: true,
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

export const rejectLoan = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { id } = request.params;
  const { rejectionReason } = request.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: 'El formato del ID ingresado es inválido',
      code: 400,
      success: false,
    });
  }

  const loan = await loanModel.findById(id);

  if (!loan) {
    return response.status(404).json({
      error: 'El préstamo no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    await loanModel.findByIdAndUpdate(id, {
      rejectionReason,
      isConfirmed: false,
      isReturned: false,
      isRejected: true,
      isCancelled: false,
    });

    return response.status(200).json({
      message: 'Préstamo rechazado exitosamente!',
      code: 200,
      success: true,
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

export const deleteLoan = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: 'El formato del ID ingresado es inválido',
      code: 400,
      success: false,
    });
  }

  const loan = await loanModel.findById(id);

  if (!loan) {
    return response.status(404).json({
      error: 'El préstamo no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    await loanModel.findByIdAndDelete(id);

    return response.status(200).json({
      message: 'Préstamo eliminado exitosamente!',
      code: 200,
      success: true,
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

export const loanDashboardAndInfo = async (
  _request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const totalLoans = await loanModel.find().countDocuments();
    const totalConfirmedLoans = await loanModel
      .find({
        isConfirmed: true,
        isReturned: false,
        isRejected: false,
        isCancelled: false,
      })
      .countDocuments();
    const totalPendingLoans = await loanModel
      .find({
        isConfirmed: false,
        isReturned: false,
        isRejected: false,
        isCancelled: false,
      })
      .countDocuments();
    const totalRejectedLoans = await loanModel
      .find({
        isConfirmed: false,
        isReturned: false,
        isRejected: true,
        isCancelled: false,
      })
      .countDocuments();
    const totalReturnedLoans = await loanModel
      .find({
        isConfirmed: true,
        isReturned: true,
        isRejected: false,
        isCancelled: false,
      })
      .countDocuments();
    const totalCancelledLoans = await loanModel
      .find({
        isConfirmed: false,
        isReturned: false,
        isRejected: false,
        isCancelled: true,
      })
      .countDocuments();

    const mostLoanedBook = await loanModel.aggregate([
      {
        $group: {
          _id: '$book',
          totalLoans: { $sum: 1 },
        },
      },
      {
        $sort: { totalLoans: -1 },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails',
        },
      },
      {
        $unwind: '$bookDetails',
      },
      {
        $project: {
          _id: 0,
          bookId: '$_id',
          totalLoans: 1,
          bookDetails: 1,
        },
      },
    ]);

    const studentWithMostLoans = await loanModel.aggregate([
      {
        $group: {
          _id: '$student',
          totalLoans: { $sum: 1 },
        },
      },
      {
        $sort: { totalLoans: -1 },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: '_id',
          as: 'studentDetails',
        },
      },
      {
        $unwind: '$studentDetails',
      },
      {
        $project: {
          _id: 0,
          studentId: '$_id',
          totalLoans: 1,
          studentDetails: 1,
        },
      },
    ]);

    const confirmedLoans = await loanModel
      .find({
        isConfirmed: true,
        isReturned: false,
        isRejected: false,
        isCancelled: false,
      })
      .populate([
        { path: 'book' },
        {
          path: 'student',
          populate: { path: 'subsection', populate: { path: 'section' } },
        },
      ]);

    const pendingLoans = await loanModel
      .find({
        isConfirmed: false,
        isReturned: false,
        isRejected: false,
        isCancelled: false,
      })
      .populate([
        { path: 'book' },
        {
          path: 'student',
          populate: { path: 'subsection', populate: { path: 'section' } },
        },
      ]);

    const rejectedLoans = await loanModel
      .find({
        isConfirmed: false,
        isReturned: false,
        isRejected: true,
        isCancelled: false,
      })
      .populate([
        { path: 'book' },
        {
          path: 'student',
          populate: { path: 'subsection', populate: { path: 'section' } },
        },
      ]);

    const returnedLoans = await loanModel
      .find({
        isConfirmed: true,
        isReturned: true,
        isRejected: false,
        isCancelled: false,
      })
      .populate([
        { path: 'book' },
        {
          path: 'student',
          populate: { path: 'subsection', populate: { path: 'section' } },
        },
      ]);

    const cancelledLoans = await loanModel
      .find({
        isConfirmed: false,
        isReturned: false,
        isRejected: false,
        isCancelled: true,
      })
      .populate([
        { path: 'book' },
        {
          path: 'student',
          populate: { path: 'subsection', populate: { path: 'section' } },
        },
      ]);

    return response.status(200).json({
      code: 200,
      success: true,
      data: {
        dashboard: {
          totalLoans,
          totalConfirmedLoans,
          totalPendingLoans,
          totalRejectedLoans,
          totalReturnedLoans,
          totalCancelledLoans,
          mostLoanedBook: mostLoanedBook[0],
          studentWithMostLoans: studentWithMostLoans[0],
        },
        loans: {
          confirmed: confirmedLoans,
          pending: pendingLoans,
          rejected: rejectedLoans,
          returned: returnedLoans,
          cancelled: cancelledLoans,
        },
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

export const cancelLoan = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: 'El formato del ID ingresado es inválido',
      code: 400,
      success: false,
    });
  }

  const loan = await loanModel.findById(id);

  if (!loan) {
    return response.status(404).json({
      error: 'El préstamo no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    await loanModel.findByIdAndUpdate(id, {
      isConfirmed: false,
      isReturned: false,
      isRejected: false,
      isCancelled: true,
    });

    return response.status(200).json({
      message: 'Préstamo cancelado exitosamente!',
      code: 200,
      success: true,
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

export const returnLoan = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: 'El formato del ID ingresado es inválido',
      code: 400,
      success: false,
    });
  }

  const loan = await loanModel.findById(id);

  if (!loan) {
    return response.status(404).json({
      error: 'El préstamo no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    const book = await bookModel.findById(loan.book);
    if (!book) {
      return response.status(404).json({
        error: 'El libro no existe en la base de datos',
        code: 404,
        success: false,
      });
    }

    book.quantity += loan.quantity;
    await book.save();

    await loanModel.findByIdAndUpdate(id, {
      isConfirmed: true,
      isReturned: true,
      isRejected: false,
      isCancelled: false,
    });

    return response.status(200).json({
      message: 'Préstamo devuelto exitosamente!',
      code: 200,
      success: true,
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
