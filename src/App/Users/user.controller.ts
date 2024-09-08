import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { generateToken } from '@utils/generateToken';
import userModel, { UserDocument } from './user.model';
import studentModel from '../Students/student.model';

export const createStudentAccount = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { code, password, role, student } = request.body;

  if (!code || !role || !password) {
    return response.status(400).json({
      error: 'Los campos de Código, Rol y Contraseña son obligatorios',
      code: 400,
      success: false,
    });
  }

  const codeExists = await userModel.findOne({ code });

  if (codeExists) {
    return response.status(409).json({
      error: 'El Código ya se encuentra registrado',
      code: 409,
      success: false,
    });
  }

  try {
    const userCreated = await userModel.create({
      code,
      role,
      password,
    });

    await studentModel.findByIdAndUpdate(student, {
      user: userCreated._id,
    });

    return response.status(201).json({
      message: 'Cuenta creada con éxito!',
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

export const loginUser = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { code, password } = request.body;

  const user: UserDocument | null = await userModel
    .findOne({ code })
    .populate('role');

  if (!user) {
    return response.status(400).json({
      error: 'Usuario no encontrado',
      code: 400,
      success: false,
    });
  }

  const matchPassword: boolean = await userModel.comparePassword(
    password,
    user.password,
  );

  if (!matchPassword) {
    return response.status(401).json({
      error: 'Contraseña incorrecta',
      code: 401,
      success: false,
    });
  }

  const role: string = user?.role.name;

  try {
    const token: string = generateToken(user, role);

    return response.status(200).json({
      message: 'Inicio de sesión exitoso!',
      code: 200,
      success: true,
      data: {
        user: user._id,
        role,
        token,
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

export const getAllUsers = async (_request: Request, response: Response) => {
  try {
    const users = await userModel.find();

    return response.status(200).json({
      code: 200,
      success: true,
      data: {
        users,
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

export const getUserById = async (request: Request, response: Response) => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: 'El formato del ID ingresado es inválido',
      code: 400,
      success: false,
    });
  }

  const user: UserDocument | null = await userModel
    .findById(id)
    .populate('role');

  if (!user) {
    return response.status(404).json({
      error: 'El Usuario no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    return response.status(200).json({
      message: 'Usuario encontrado!',
      code: 200,
      success: true,
      data: {
        user,
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

export const updateUser = async (request: Request, response: Response) => {
  const { id } = request.params;
  const payload = request.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: 'El formato del ID ingresado es inválido',
      code: 400,
      success: false,
    });
  }

  const user: UserDocument | null = await userModel.findById(id);

  if (!user) {
    return response.status(404).json({
      error: 'El Usuario no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  if (Object.keys(payload).length === 0) {
    return response.status(400).json({
      error: 'El cuerpo de la petición no puede estar vacío',
      code: 400,
      success: false,
    });
  }

  try {
    const userUpdated = await userModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    return response.status(200).json({
      message: 'Usuario actualizado!',
      code: 200,
      success: true,
      data: {
        user: userUpdated,
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

export const deleteUser = async (request: Request, response: Response) => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: 'El formato del ID ingresado es inválido',
      code: 400,
      success: false,
    });
  }

  const user: UserDocument | null = await userModel.findById(id);

  if (!user) {
    return response.status(404).json({
      error: 'El Usuario no existe en la base de datos',
      code: 404,
      success: false,
    });
  }

  try {
    await userModel.findByIdAndDelete(id);

    return response.status(200).json({
      message: 'Usuario eliminado!',
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
