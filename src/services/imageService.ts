import sharp from 'sharp';
import path from 'node:path';
import type { ImageMetadata } from '@/types/image.types';

const PUBLIC_DIR = 'public';

export async function resizeImage(
  imageName: string,
  width: number
): Promise<boolean> {
  const imagePath = path.join(PUBLIC_DIR, imageName);
  const outputPath = path.join(PUBLIC_DIR, `resized-${imageName}`);

  try {
    await sharp(imagePath).resize(width).toFile(outputPath);
    // eslint-disable-next-line
    console.log(`Imagen redimensionada con éxito: ${outputPath}`);
    return true;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error al redimensionar la imagen:', error);
    return false;
  }
}

export async function getMetadata(
  imageName: string
): Promise<ImageMetadata | null> {
  const imagePath = path.join(PUBLIC_DIR, imageName);

  try {
    const metadata = await sharp(imagePath).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || ''
    };
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error al obtener metadatos:', error);
    return null;
  }
}
