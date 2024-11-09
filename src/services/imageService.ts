import sharp, { type Metadata } from 'sharp';
import { JPEG_QUALITY_LEVEL } from '../constants/image.constants';
interface ResizeImageParams {
  inputPath: string;
  outputPath: string;
  targetResolution: number;
  originalResolution: number;
  isVertical: boolean;
}

export async function getMetadata(imagePath: string): Promise<Metadata> {
  try {
    const metadata = await sharp(imagePath).metadata();
    return metadata;
  } catch (error) {
    throw new Error(
      `Error al leer metadatos: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function resizeImage({
  inputPath,
  outputPath,
  targetResolution,
  originalResolution,
  isVertical
}: ResizeImageParams): Promise<void> {
  try {
    const pipeline = sharp(inputPath);

    // Primero aplicamos el resize si es necesario
    if (originalResolution > targetResolution) {
      pipeline.resize({
        ...(isVertical
          ? { height: targetResolution }
          : { width: targetResolution }),
        withoutEnlargement: true
      });
    }

    // Luego forzamos la conversión a JPEG con las opciones de calidad
    await pipeline
      .toFormat('jpeg', {
        quality: JPEG_QUALITY_LEVEL,
        mozjpeg: true
      })
      .toFile(outputPath);
  } catch (error) {
    throw new Error(
      `Error al redimensionar imagen: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
