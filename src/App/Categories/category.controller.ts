import { Request, Response } from 'express';

import categoryModel from './category.model';

export const getAllCategories = async (
  _request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const categories = await categoryModel.find();

    return response.status(200).json({
      code: 200,
      success: true,
      data: categories,
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

export const createCategory = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const categories = request.body;

  try {
    const categoriesCreated = await categoryModel.insertMany(categories);

    return response.status(201).json({
      message: 'Categorías creadas y agregadas con éxito!',
      code: 201,
      success: true,
      data: categoriesCreated,
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
