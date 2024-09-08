import roleModel from '@src/App/Roles/role.model';
import { config } from '@config/config';

const { roles } = config;

export const setRoles = async () => {
  try {
    const count = await roleModel.estimatedDocumentCount();

    if (count > 0)
      return console.log(
        '===========================================================\n' +
          '               Los roles ya han sido creados',
      );

    await roleModel.create(
      roles.map((role) => ({
        name: role,
      })),
    );

    console.log(
      '===========================================================\n' +
        '                 Roles creados exitosamente!',
    );
  } catch (err) {
    return console.error(err);
  }
};
