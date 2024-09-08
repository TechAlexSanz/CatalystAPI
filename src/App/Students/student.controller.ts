import { Request, Response } from 'express';
import mongoose from 'mongoose';
import studentModel, { StudentDocument } from './student.model';
import subsectionModel from '../SubSections/subsection.model';

export const getStudentByUserId = async (
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

  const student = await studentModel.findOne({ user: id }).populate('user');

  if (!student) {
    return response.status(404).json({
      error: 'El estudiante no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    return response.status(200).json({
      message: 'Estudiante encontrado!',
      code: 200,
      success: true,
      data: student,
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

export const getAllStudents = async (
  _request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const students = await studentModel.find().populate(['subsection', 'user']);

    return response.status(200).json({
      code: 200,
      success: true,
      data: students,
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

export const getStudentsBySubSection = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const { id } = request.params;

    const students = await studentModel
      .find({ subsection: id })
      .populate(['subsection', 'user']);

    return response.status(200).json({
      code: 200,
      success: true,
      data: students,
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

export const getStudentById = async (
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

  const student: StudentDocument | null = await studentModel
    .findById(id)
    .populate([
      { path: 'user' },
      {
        path: 'subsection',
        populate: { path: 'section' },
      },
    ]);

  if (!student) {
    return response.status(404).json({
      error: 'El Estudiante no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    return response.status(200).json({
      message: 'Estudiante encontrado!',
      code: 200,
      success: true,
      data: student,
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

export const createStudent = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const {
    firstName,
    secondName,
    thirdName,
    firstSurname,
    secondSurname,
    numberPhone,
    subsection,
  } = request.body;

  if (!firstName || !firstSurname || !numberPhone || !subsection) {
    return response.status(400).json({
      error: 'Por favor, complete todos los campos obligatorios del formulario',
      code: 400,
      success: false,
    });
  }

  // numero salvadoreño
  const formattedPhone = numberPhone ? numberPhone.replace(/[^0-9]/g, '') : '';

  const availableNumbers: { [key: number]: boolean } = { 6: true, 7: true };

  if (formattedPhone.length !== 8 || !availableNumbers[formattedPhone[0]]) {
    return response.status(400).json({
      error: 'El número de teléfono ingresado es inválido',
      code: 400,
      success: false,
    });
  }

  if (!mongoose.Types.ObjectId.isValid(subsection)) {
    return response.status(400).json({
      error: 'El formato del ID de la Categoría ingresado es inválido',
      code: 400,
      success: false,
    });
  }

  const subsectionExists = await subsectionModel.findById(subsection);

  if (!subsectionExists) {
    return response.status(404).json({
      error: 'La Sección no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    await studentModel.create({
      firstName,
      secondName,
      thirdName,
      firstSurname,
      secondSurname,
      numberPhone,
      subsection,
    });

    return response.status(201).json({
      message: 'Estudiante creado exitosamente!',
      code: 201,
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

export const updateStudent = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { id } = request.params;
  const {
    firstName,
    secondName,
    thirdName,
    firstSurname,
    secondSurname,
    numberPhone,
  } = request.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: 'El formato del ID ingresado es inválido',
      code: 400,
      success: false,
    });
  }

  const student: StudentDocument | null = await studentModel.findById(id);

  if (!student) {
    return response.status(404).json({
      error: 'El Estudiante no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  if (!firstName || !firstSurname || !numberPhone) {
    return response.status(400).json({
      error: 'Por favor, complete todos los campos obligatorios del formulario',
      code: 400,
      success: false,
    });
  }

  const formattedPhone = numberPhone ? numberPhone.replace(/[^0-9]/g, '') : '';

  const availableNumbers: { [key: number]: boolean } = { 6: true, 7: true };

  if (formattedPhone.length !== 8 || !availableNumbers[formattedPhone[0]]) {
    return response.status(400).json({
      error: 'El número de teléfono ingresado es inválido',
      code: 400,
      success: false,
    });
  }

  try {
    await studentModel.findByIdAndUpdate(id, {
      firstName,
      secondName,
      thirdName,
      firstSurname,
      secondSurname,
      numberPhone,
    });

    return response.status(200).json({
      message: 'Estudiante actualizado exitosamente!',
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

export const deleteStudent = async (
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

  const student: StudentDocument | null = await studentModel.findById(id);

  if (!student) {
    return response.status(404).json({
      error: 'El Estudiante no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    await studentModel.findByIdAndDelete(id);

    return response.status(200).json({
      message: 'Estudiante eliminado exitosamente!',
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
