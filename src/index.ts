import path from 'node:path';
import { getMetadata, resizeImage } from './services/imageService';
import { fileExists } from './utils/fileUtils';

const MAX_IMAGE_HEIGHT = 2160;

async function main(): Promise<void> {
  const imageName = 'example.jpg';
  const imagePath = path.join('public', imageName);

  if (!(await fileExists(imagePath))) {
    console.error(`La imagen ${imageName} no existe en la carpeta public.`);
    return;
  }

  const metadata = await getMetadata(imageName);
  if (metadata != null) {
    console.log('Metadatos obtenidos con éxito:', metadata);
  } else {
    console.log('No se pudieron obtener los metadatos');
  }

  const resizeSuccess = await resizeImage(imageName, MAX_IMAGE_HEIGHT);
  if (!resizeSuccess) {
    console.log('No se pudo redimensionar la imagen');
  }
}

main().catch((error) => {
  console.error('Error en la ejecución principal:', error);
});
