import path from 'node:path';
//import { getMetadata, resizeImage } from './services/imageService';
import { fileExists } from './utils/fileUtils';
//import inquirer from 'inquirer';
import { homedir } from 'node:os';
import chalk from 'chalk';
import fs from 'node:fs/promises';
import ora from 'ora';

//const MAX_IMAGE_HEIGHT = 2160;
const ANIMATION_DELAY_MS = 2000;
const EMPTY_LENGTH = 0;

async function main(): Promise<void> {
  const desktopPath = path.join(homedir(), 'Desktop');

  const imagesPath = path.join(desktopPath, 'images');

  let spinner = ora({
    text: chalk.blue('Comprobando carpeta images en el escritorio...'),
    color: 'cyan'
  }).start();

  // Simular un pequeño delay para ver la animación
  await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAY_MS));

  const exists = await fileExists(imagesPath);

  if (!exists) {
    spinner.warn(chalk.yellow('No se encontró la carpeta images'));
    console.error(chalk.red('La carpeta images no existe en el escritorio 😥'));
    return;
  }

  spinner.succeed(chalk.green('Carpeta images encontrada correctamente'));

  // Nuevo spinner para comprobar contenido
  spinner = ora({
    text: chalk.blue('Comprobando contenido de la carpeta...'),
    color: 'cyan'
  }).start();

  // Simular delay para la animación
  await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAY_MS));

  // Leer el contenido del directorio
  const files = await fs.readdir(imagesPath);
  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );

  if (imageFiles.length === EMPTY_LENGTH) {
    spinner.fail(chalk.yellow('Carpeta images vacía'));
    console.error(
      chalk.red(
        '😥 La carpeta images no contiene ninguna imágen. Añade algunas 📸'
      )
    );
    return;
  }

  spinner.succeed(
    chalk.green(`Se encontraron ${imageFiles.length} imágenes 🖼️`)
  );

  /*   const metadata = await getMetadata(imageName);
  if (metadata != null) {
    console.log('Metadatos obtenidos con éxito:', metadata);
  } else {
    console.log('No se pudieron obtener los metadatos');
  }

  const resizeSuccess = await resizeImage(imageName, MAX_IMAGE_HEIGHT);
  if (!resizeSuccess) {
    console.log('No se pudo redimensionar la imagen');
  }*/
}

main().catch((error) => {
  console.error('Error en la ejecución principal:', error);
});
