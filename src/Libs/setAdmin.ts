import roleModel from '@app/Roles/role.model';
import { config } from '@config/config';
import userModel from '@app/Users/user.model';

const { adminCredentials } = config;
const { code, password } = adminCredentials;

export const SetAdmin = async () => {
  try {
    const existsAdmin = await userModel.findOne({ code });

    if (existsAdmin) {
      return console.log(
        '===========================================================\n' +
          '                   Admin ya ha sido creado!',
      );
    }

    const adminRole = await roleModel.findOne({ name: 'admin' });

    if (!adminRole)
      return console.error('El rol de administrador no ha sido creado');

    await userModel.create({
      code,
      password,
      role: adminRole._id,
    });

    console.log(
      '===========================================================\n' +
        '                 Admin creado exitosamente!',
    );
  } catch (err) {
    return console.error(err);
  }
};
