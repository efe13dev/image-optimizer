import path from 'node:path';
import { getMetadata, resizeImage } from './services/imageService';
import { fileExists } from './utils/fileUtils';
import inquirer from 'inquirer';
import { homedir } from 'node:os';
import chalk from 'chalk';
import fs from 'node:fs/promises';
import ora from 'ora';

const ANIMATION_DELAY_MS = 1000;
const EMPTY_LENGTH = 0;
const DEFAULT_HEIGHT = 0;

const RESOLUTION_1440P = 1440;
const RESOLUTION_900P = 900;

const RESOLUTIONS = {
  '1440p': RESOLUTION_1440P,
  '900p': RESOLUTION_900P
} as const;

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
    spinner.fail(chalk.red('No se encontró la carpeta images'));
    console.error('La carpeta images no existe en el escritorio 😥');
    return;
  }

  spinner.succeed(chalk.green('Carpeta images encontrada!!'));

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
    spinner.fail(chalk.red('Carpeta images vacía'));
    console.error(
      '😥 La carpeta images no contiene ninguna imágen. Añade algunas 📸'
    );
    return;
  }

  spinner.succeed(
    chalk.green(`Se encontraron ${imageFiles.length} imágenes 🖼️`)
  );

  const { resolution } = await inquirer.prompt<{ resolution: number }>([
    {
      type: 'list',
      name: 'resolution',
      message: '¿A qué resolución quieres optimizar las imágenes?',
      choices: [
        { name: '1440p - Alta calidad', value: RESOLUTIONS['1440p'] },
        { name: '900p - Calidad media', value: RESOLUTIONS['900p'] }
      ]
    }
  ]);

  console.log(chalk.blue(`Optimizando imágenes a ${resolution}p`));

  // Procesar cada imagen
  for (const imageFile of imageFiles) {
    const imagePath = path.join(imagesPath, imageFile);

    spinner = ora({
      text: chalk.blue(`Procesando ${imageFile}...`),
      color: 'cyan'
    }).start();

    try {
      // Obtener metadatos de la imagen
      const metadata = await getMetadata(imagePath);

      // Crear nombre para la imagen optimizada
      const optimizedName = `optimized-${resolution}-${imageFile}`;
      const outputPath = path.join(imagesPath, optimizedName);

      // Redimensionar y optimizar la imagen
      await resizeImage({
        inputPath: imagePath,
        outputPath,
        targetHeight: resolution,
        originalHeight: metadata.height ?? DEFAULT_HEIGHT
      });

      spinner.succeed(chalk.green(`✨ ${imageFile} optimizada correctamente`));
    } catch (error) {
      spinner.fail(chalk.red(`Error procesando ${imageFile}`));
      console.error(`Error en ${imageFile}:`, error);
    }
  }

  console.log(chalk.green.bold('\n¡Proceso completado! 🎉'));
}

main().catch((error) => {
  console.error('Error en la ejecución principal:', error);
});
