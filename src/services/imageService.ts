import sharp, { type Metadata } from 'sharp';

interface ResizeImageParams {
  inputPath: string;
  outputPath: string;
  targetHeight: number;
  originalHeight: number;
}

const JPEG_QUALITY_LEVEL = 90;

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
  targetHeight,
  originalHeight
}: ResizeImageParams): Promise<void> {
  try {
    if (originalHeight > targetHeight) {
      await sharp(inputPath)
        .resize({
          height: targetHeight,
          width: undefined,
          withoutEnlargement: true
        })
        .jpeg({
          quality: JPEG_QUALITY_LEVEL,
          mozjpeg: true
        })
        .toFile(outputPath);
    } else {
      await sharp(inputPath)
        .jpeg({
          quality: JPEG_QUALITY_LEVEL,
          mozjpeg: true
        })
        .toFile(outputPath);
    }
  } catch (error) {
    throw new Error(
      `Error al redimensionar imagen: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
