import jwt from 'jsonwebtoken';
import { config } from '@config/config';
import { UserDocument } from '@app/Users/user.model';

const { jwtOptions } = config;
const { tokenSecret } = jwtOptions;

type GenerateTokenFunction = (user: UserDocument, role: string) => string;

export const generateToken: GenerateTokenFunction = (user, role) => {
  try {
    if (!user || !user._id) {
      throw new Error('Usuario inválido');
    }

    return jwt.sign({ id: user._id, code: user.code, role }, tokenSecret, {
      expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    });
  } catch (err) {
    console.error(err);
    throw new Error('Error al generar el token');
  }
};
