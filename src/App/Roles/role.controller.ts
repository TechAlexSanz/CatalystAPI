import { Request, Response } from 'express';
import roleModel, { RoleDocument } from './role.model';

export const getAllRoles = async (
  _request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const roles = await roleModel.find();

    return response.status(200).json({
      code: 200,
      success: true,
      data: {
        roles,
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

export const getRoleByName = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const { name } = request.params;

    const role: RoleDocument | null = await roleModel.findOne({ name });

    if (!role) {
      return response.status(404).json({
        error: 'Rol no encontrado',
        code: 404,
        success: false,
      });
    }

    return response.status(200).json({
      message: 'Rol encontrado!',
      code: 200,
      success: true,
      data: {
        role,
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
