import { Request, Response } from 'express';
import mongoose from 'mongoose';
import subSectionModel, { SubSectionDocument } from './subsection.model';

export const getAllSubSections = async (
  _request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const subSections = await subSectionModel.find().populate({
      path: 'students',
      populate: {
        path: 'user',
        model: 'users',
      },
    });

    return response.status(200).json({
      code: 200,
      success: true,
      data: subSections,
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

export const getSubSectionByName = async (
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

  const subSection: SubSectionDocument | null = await subSectionModel
    .findOne({ name })
    .populate({
      path: 'students',
      populate: {
        path: 'user',
        model: 'users',
      },
    });

  if (!subSection) {
    return response.status(404).json({
      error: 'La SubSección no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    return response.status(200).json({
      message: 'SubSección encontrada!',
      code: 200,
      success: true,
      data: subSection,
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

export const getSubSectionById = async (
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

  const subSection: SubSectionDocument | null = await subSectionModel
    .findById(id)
    .populate({
      path: 'students',
      populate: {
        path: 'user',
        model: 'users',
      },
    });

  if (!subSection) {
    return response.status(404).json({
      error: 'La SubSección no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    return response.status(200).json({
      message: 'SubSección encontrada!',
      code: 200,
      success: true,
      data: subSection,
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

export const createSubSection = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { name, section } = request.body;

  if (!name) {
    return response.status(400).json({
      error: 'Por favor, complete todos los campos obligatorios del formulario',
      code: 400,
      success: false,
    });
  }

  try {
    await subSectionModel.create({
      name,
      section,
    });

    return response.status(201).json({
      message: 'SubSección creada exitosamente!',
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

export const updateSubSection = async (
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

  const subSection: SubSectionDocument | null =
    await subSectionModel.findById(id);

  if (!subSection) {
    return response.status(404).json({
      error: 'La SubSección no existe en la base de datos',
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
    await subSectionModel.findByIdAndUpdate(id, {
      name,
    });

    return response.status(200).json({
      message: 'SubSección actualizada exitosamente!',
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

export const deleteSubSection = async (
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

  const subSection: SubSectionDocument | null =
    await subSectionModel.findById(id);

  if (!subSection) {
    return response.status(404).json({
      error: 'La SubSección no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    await subSectionModel.findByIdAndDelete(id);

    return response.status(200).json({
      message: 'SubSección eliminada exitosamente!',
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
