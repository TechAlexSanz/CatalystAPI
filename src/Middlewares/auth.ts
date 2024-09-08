import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '@config/config';
import userModel from '@app/Users/user.model';
import { User } from '@appTypes/User';

const { jwtOptions } = config;
const { tokenSecret } = jwtOptions;

export const verifyAdminToken = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authorizationHeader: string | undefined = request.headers.authorization;

  if (!authorizationHeader) {
    return response.status(403).json({
      error: 'El token no fue proporcionado en el encabezado Authorization',
      code: 403,
      success: false,
    });
  }

  const [bearer, token] = authorizationHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return response.status(403).json({
      error: 'El formato del token es inválido',
      code: 403,
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, tokenSecret);

    const { id } = decoded as { id: string };

    const user: User | null = await userModel.findById(id).populate('role');

    if (!user) {
      return response.status(404).json({
        error: 'Usuario no encontrado en la base de datos',
        code: 404,
        success: false,
      });
    }

    if (!user.role || !user.role.name) {
      return response.status(403).json({
        error: 'El usuario no tiene un rol válido asignado',
        code: 403,
        success: false,
      });
    }

    if (user.role.name !== 'admin') {
      return response.status(403).json({
        error: 'Requiere rol de admin para realizar esta acción',
        code: 403,
        success: false,
      });
    }

    return next();
  } catch (err) {
    console.error(err);

    if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
      return response.status(401).json({
        error: 'Token inválido (expirado) o mal formado',
        code: 401,
        success: false,
      });
    }

    return response.status(500).json({
      error: 'Error interno del servidor',
      code: 500,
      success: false,
    });
  }
};

export const verifyUserToken = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authorizationHeader: string | undefined = request.headers.authorization;

  if (!authorizationHeader) {
    return response.status(403).json({
      error: 'El token no fue proporcionado en el encabezado Authorization',
      code: 403,
      success: false,
    });
  }

  const [bearer, token] = authorizationHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return response.status(403).json({
      error: 'El formato del token es inválido',
      code: 403,
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, tokenSecret);

    const { id } = decoded as { id: string };

    const user: User | null = await userModel.findById(id).populate('role');

    if (!user) {
      return response.status(404).json({
        error: 'Usuario no encontrado en la base de datos',
        code: 404,
        success: false,
      });
    }

    if (!user.role || !user.role.name) {
      return response.status(403).json({
        error: 'El usuario no tiene un rol válido asignado',
        code: 403,
        success: false,
      });
    }

    if (user.role.name !== 'usuario') {
      return response.status(403).json({
        error: 'Requiere rol de usuario para realizar esta acción',
        code: 403,
        success: false,
      });
    }

    return next();
  } catch (err) {
    console.error(err);

    if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
      return response.status(401).json({
        error: 'Token inválido (expirado) o mal formado',
        code: 401,
        success: false,
      });
    }

    return response.status(500).json({
      error: 'Error interno del servidor',
      code: 500,
      success: false,
    });
  }
};
