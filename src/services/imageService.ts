import sharp from 'sharp';
import path from 'node:path';
import type { ImageMetadata } from '@/types/image.types';

const PUBLIC_DIR = 'public';
const DEFAULT_DIMENSION = 0;
const DEFAULT_FORMAT = '';

export async function resizeImage(
  imageName: string,
  width: number
): Promise<boolean> {
  const imagePath = path.join(PUBLIC_DIR, imageName);
  const outputPath = path.join(PUBLIC_DIR, `resized-${imageName}`);

  try {
    await sharp(imagePath).resize(width).toFile(outputPath);

    console.log(`Imagen redimensionada con éxito: ${outputPath}`);
    return true;
  } catch (error) {
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
      width: metadata.width ?? DEFAULT_DIMENSION,
      height: metadata.height ?? DEFAULT_DIMENSION,
      format: metadata.format ?? DEFAULT_FORMAT
    };
  } catch (error) {
    console.error('Error al obtener metadatos:', error);
    return null;
  }
}
