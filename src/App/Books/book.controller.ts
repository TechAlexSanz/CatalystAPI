import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { UploadApiResponse } from 'cloudinary';
import uploadImage from '@utils/cloudinary';
import bookModel, { BookDocument } from './book.model';
import categoryModel from '../Categories/category.model';

export const getAllBooks = async (
  _request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const activeBooks = await bookModel
      .find({
        status: 'active',
      })
      .populate('categories');
    const disabledBooks = await bookModel
      .find({
        status: 'inactive',
      })
      .populate('categories');
    const deletedBooks = await bookModel
      .find({
        status: 'deleted',
      })
      .populate('categories');

    return response.status(200).json({
      code: 200,
      data: {
        active: activeBooks,
        inactive: disabledBooks,
        deleted: deletedBooks,
      },
    });
  } catch (err) {
    console.error(err);

    return response.status(500).json({
      error: 'Error interno del servidor',
      code: 500,
    });
  }
};

export const getBookById = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: 'El formato del ID ingresado es inválido',
      code: 400,
    });
  }

  const book = await bookModel.findById(id).populate('categories');

  if (!book) {
    return response.status(404).json({
      error: 'El libro no existe en la base de datos',
      code: 404,
    });
  }

  try {
    return response.status(200).json({
      message: 'Libro encontrado!',
      code: 200,
      book,
    });
  } catch (err) {
    console.error(err);

    return response.status(500).json({
      error: 'Error interno del servidor',
      code: 500,
    });
  }
};

export const getActiveBooks = async (
  _request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const books = await bookModel
      .find({ status: 'active' })
      .populate('categories');

    return response.status(200).json({
      code: 200,
      books,
    });
  } catch (err) {
    console.error(err);

    return response.status(500).json({
      error: 'Error interno del servidor',
      code: 500,
    });
  }
};

export const getBooksByCategory = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: 'El formato del ID ingresado es inválido',
      code: 400,
    });
  }

  const categoryExists = await categoryModel.findById(id);

  if (!categoryExists) {
    return response.status(404).json({
      error: 'La subcategoría no existe en la base de datos',
      code: 404,
    });
  }

  try {
    const books = await bookModel.find({ categories: id });

    return response.status(200).json({
      code: 200,
      books,
    });
  } catch (err) {
    console.error(err);

    return response.status(500).json({
      error: 'Error interno del servidor',
      code: 500,
    });
  }
};

export const createBook = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { title, description, author, publisher, quantity, categories } =
    request.body;

  if (!title || !author || !quantity) {
    return response.status(400).json({
      error: 'Por favor, complete todos los campos obligatorios del formulario',
      code: 400,
    });
  }

  if (!request.file) {
    return response.status(400).json({
      error: 'Por favor, suba una imagen de portada',
      code: 400,
    });
  }

  const allowedExtensions = ['.png', '.jpeg', '.jpg'];

  const fileExt = request.file.originalname.split('.').pop()?.toLowerCase();

  if (!fileExt || !allowedExtensions.includes(`.${fileExt}`)) {
    return response.status(400).json({
      error:
        'Formato de imagen no soportado. Por favor, use archivos PNG, JPEG o JPG',
      code: 400,
    });
  }

  const categoryIds = categories.split(',').map((id: string) => id.trim());

  try {
    const result = (await uploadImage(request.file.path)) as UploadApiResponse;

    const bookImage = result.secure_url;

    const bookCreated = await bookModel.create({
      title,
      description,
      author,
      publisher,

      quantity,
      coverImage: bookImage,
      categories: categoryIds,
    });

    return response.status(201).json({
      message: 'Libro creado exitosamente!',
      code: 201,
      data: bookCreated,
    });
  } catch (err) {
    console.error(err);

    return response.status(500).json({
      error: 'Error interno del servidor',
      code: 500,
    });
  }
};

export const updateBook = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: 'El formato del ID ingresado es inválido',
      code: 400,
    });
  }

  const { title, description, author, publisher, quantity, categories } =
    request.body;

  if (!title || !author || !quantity) {
    return response.status(400).json({
      error: 'Por favor, complete todos los campos obligatorios del formulario',
      code: 400,
    });
  }

  try {
    const book = await bookModel.findById(id);

    if (!book) {
      return response.status(404).json({
        error: 'El libro no existe en la base de datos',
        code: 404,
      });
    }

    await bookModel.findByIdAndUpdate(id, {
      title,
      description,
      author,
      publisher,
      quantity,
      categories,
    });

    return response.status(200).json({
      message: 'Libro actualizado exitosamente!',
      code: 200,
    });
  } catch (err) {
    console.error(err);

    return response.status(500).json({
      error: 'Error interno del servidor',
      code: 500,
    });
  }
};

export const updateCoverImage = async (
  request: Request,
  response: Response,
) => {
  const { id } = request.params;

  const book: BookDocument | null = await bookModel.findById(id);

  if (!book) {
    return response.status(404).json({
      error: 'El Libro no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    if (!request.file) {
      return response.status(400).json({
        error: 'Por favor, suba una imagen de portada',
        code: 400,
      });
    }

    const allowedExtensions = ['.png', '.jpeg', '.jpg'];

    const fileExt = request.file.originalname.split('.').pop()?.toLowerCase();

    if (!fileExt || !allowedExtensions.includes(`.${fileExt}`)) {
      return response.status(400).json({
        error:
          'Formato de imagen no soportado. Por favor, use archivos PNG, JPEG o JPG',
        code: 400,
      });
    }

    const result = (await uploadImage(request.file.path)) as UploadApiResponse;

    const coverImage = result.secure_url;

    await bookModel.findByIdAndUpdate(id, { coverImage }, { new: true });

    return response.status(200).json({
      message: 'Imagen de portada actualizada!',
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

export const deleteBook = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: 'El formato del ID ingresado es inválido',
      code: 400,
    });
  }

  const book = await bookModel.findById(id);

  if (!book) {
    return response.status(404).json({
      error: 'El libro no existe en la base de datos',
      code: 404,
    });
  }

  try {
    await bookModel.findByIdAndUpdate(id, {
      status: 'deleted',
    });

    return response.status(200).json({
      message: 'Libro eliminado exitosamente!',
      code: 200,
    });
  } catch (err) {
    console.error(err);

    return response.status(500).json({
      error: 'Error interno del servidor',
      code: 500,
    });
  }
};

export const restoreBook = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: 'El formato del ID ingresado es inválido',
      code: 400,
    });
  }

  const book = await bookModel.findById(id);

  if (!book) {
    return response.status(404).json({
      error: 'El libro no existe en la base de datos',
      code: 404,
    });
  }

  try {
    await bookModel.findByIdAndUpdate(id, {
      status: 'active',
    });

    return response.status(200).json({
      message: 'Libro habilitado exitosamente!',
      code: 200,
    });
  } catch (err) {
    console.error(err);

    return response.status(500).json({
      error: 'Error interno del servidor',
      code: 500,
    });
  }
};

export const disableBook = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: 'El formato del ID ingresado es inválido',
      code: 400,
    });
  }

  const book = await bookModel.findById(id);

  if (!book) {
    return response.status(404).json({
      error: 'El libro no existe en la base de datos',
      code: 404,
    });
  }

  try {
    await bookModel.findByIdAndUpdate(id, {
      status: 'inactive',
    });

    return response.status(200).json({
      message: 'Libro deshabilitado exitosamente!',
      code: 200,
    });
  } catch (err) {
    console.error(err);

    return response.status(500).json({
      error: 'Error interno del servidor',
      code: 500,
    });
  }
};
