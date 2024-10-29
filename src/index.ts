import path from 'node:path';
import { getMetadata, resizeImage } from './services/imageService';
import { fileExists } from './utils/fileUtils';
//import inquirer from 'inquirer';
import { homedir } from 'node:os';
import chalk from 'chalk';
import fs from 'node:fs/promises';

const MAX_IMAGE_HEIGHT = 2160;

async function main(): Promise<void> {
  const desktopPath = path.join(homedir(), 'Desktop');

  const imagesPath = path.join(desktopPath, 'images');
  console.log(chalk.green('Comprobando carpeta images en el escritorio...'));

  if (!(await fileExists(imagesPath))) {
    console.error(chalk.red('La carpeta images no existe en el escritorio 😥'));
    return;
  }

  // Leer el contenido del directorio
  const files = await fs.readdir(imagesPath);
  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );

  if (imageFiles.length === 0) {
    console.error(
      chalk.red(
        'La carpeta images está vacía. Por favor, añade algunas imágenes 📸'
      )
    );
    return;
  }

  console.log(chalk.green(`Se encontraron ${imageFiles.length} imágenes 🖼️`));

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
