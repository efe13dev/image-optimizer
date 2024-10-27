import sharp from 'sharp';
import path from 'node:path';

async function getMetadata(imageName: string): Promise<sharp.Metadata | null> {
  try {
    const imagePath = path.join('public', imageName);
    const metadata = await sharp(imagePath).metadata();
    return metadata;
  } catch (error) {
    console.error('Error al obtener los metadatos:', error);
    return null;
  }
}

async function resizeImage(imageName: string, width: number): Promise<boolean> {
  const imagePath = path.join('public', imageName);
  const outputPath = path.join('public', `resized-${imageName}`);

  try {
    await sharp(imagePath).resize(width).toFile(outputPath);
    console.log(`Imagen redimensionada con éxito: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Error al redimensionar la imagen:', error);
    return false;
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    return await Bun.file(filePath).exists();
  } catch {
    return false;
  }
}

async function main() {
  const imageName = 'exampl.jpg';
  const imagePath = path.join('public', imageName);

  if (!(await fileExists(imagePath))) {
    console.error(`La imagen ${imageName} no existe en la carpeta public.`);
    return;
  }

  const metadata = await getMetadata(imageName);
  if (metadata) {
    console.log('Metadatos obtenidos con éxito:', metadata);
  } else {
    console.log('No se pudieron obtener los metadatos');
  }

  const resizeSuccess = await resizeImage(imageName, 2160);
  if (!resizeSuccess) {
    console.log('No se pudo redimensionar la imagen');
  }
}

main().catch((error) =>
  console.error('Error en la ejecución principal:', error)
);
