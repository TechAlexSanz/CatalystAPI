import { Request, Response } from 'express';
import mongoose from 'mongoose';
import sectionModel, { SectionDocument } from './section.model';

export const getAllSections = async (
  _request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const sections = await sectionModel.find().populate({
      path: 'subsections',
      populate: {
        path: 'students',
        model: 'students',
      },
    });

    return response.status(200).json({
      code: 200,
      success: true,
      data: sections,
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

export const getSectionByName = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { name } = request.params;

  if (!name) {
    return response.status(400).json({
      error: 'Por favor, complete todos los campos obligatorios del formulario',
      code: 400,
      success: false,
    });
  }

  const section: SectionDocument | null = await sectionModel
    .findOne({ name })
    .populate({
      path: 'subsections',
      populate: {
        path: 'students',
        model: 'students',
      },
    });

  if (!section) {
    return response.status(404).json({
      error: 'La Sección no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    return response.status(200).json({
      message: 'Sección encontrada!',
      code: 200,
      success: true,
      data: section,
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

export const getSectionById = async (
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

  const section: SectionDocument | null = await sectionModel
    .findById(id)
    .populate({
      path: 'subsections',
      populate: {
        path: 'students',
        model: 'students',
      },
    });

  if (!section) {
    return response.status(404).json({
      error: 'La Sección no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    return response.status(200).json({
      message: 'Sección encontrada!',
      code: 200,
      success: true,
      data: section,
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

export const createSection = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { name } = request.body;

  if (!name) {
    return response.status(400).json({
      error: 'Por favor, complete todos los campos obligatorios del formulario',
      code: 400,
      success: false,
    });
  }

  try {
    await sectionModel.create({
      name,
    });

    return response.status(201).json({
      message: 'Sección creada exitosamente!',
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

export const updateSection = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { id } = request.params;
  const { name } = request.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: 'El formato del ID ingresado es inválido',
      code: 400,
      success: false,
    });
  }

  const section: SectionDocument | null = await sectionModel.findById(id);

  if (!section) {
    return response.status(404).json({
      error: 'La Sección no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  if (!name) {
    return response.status(400).json({
      error: 'Por favor, complete todos los campos obligatorios del formulario',
      code: 400,
      success: false,
    });
  }

  try {
    await sectionModel.findByIdAndUpdate(id, {
      name,
    });

    return response.status(200).json({
      message: 'Sección actualizada exitosamente!',
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

export const deleteSection = async (
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

  const section: SectionDocument | null = await sectionModel.findById(id);

  if (!section) {
    return response.status(404).json({
      error: 'La Sección no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    await sectionModel.findByIdAndDelete(id);

    return response.status(200).json({
      message: 'Sección eliminada exitosamente!',
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
