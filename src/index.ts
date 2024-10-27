import path from 'node:path';
import { getMetadata, resizeImage } from './services/imageService';
import { fileExists } from './utils/fileUtils';

async function main() {
  const imageName = 'example.jpg';
  const imagePath = path.join('public', imageName);

  if (!(await fileExists(imagePath))) {
    // eslint-disable-next-line
    console.error(`La imagen ${imageName} no existe en la carpeta public.`);
    return;
  }

  const metadata = await getMetadata(imageName);
  if (metadata) {
    // eslint-disable-next-line
    console.log('Metadatos obtenidos con éxito:', metadata);
  } else {
    // eslint-disable-next-line
    console.log('No se pudieron obtener los metadatos');
  }

  const resizeSuccess = await resizeImage(imageName, 2160);
  if (!resizeSuccess) {
    // eslint-disable-next-line
    console.log('No se pudo redimensionar la imagen');
  }
}

main().catch((error) => {
  // eslint-disable-next-line
  console.error('Error en la ejecución principal:', error);
});
