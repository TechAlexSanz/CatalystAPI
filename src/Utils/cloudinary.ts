import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { config } from '@config/config';

const { cloudinaryConfig } = config;
const { cloudName, apiKey, apiSecret } = cloudinaryConfig;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

const uploadImage = async (
  file: string,
): Promise<UploadApiResponse | Error> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'book-images',
    });

    return result;
  } catch (error) {
    console.error('Error al cargar la imagen a Cloudinary:', error);

    throw new Error(
      'No se pudo cargar la imagen. Por favor, inténtalo de nuevo más tarde.',
    );
  }
};

export default uploadImage;
