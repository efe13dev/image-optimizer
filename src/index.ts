import path from 'node:path';
import { getMetadata, resizeImage } from './services/imageService';
import { fileExists } from './utils/fileUtils';
import inquirer from 'inquirer';
import { homedir } from 'node:os';
import chalk from 'chalk';
import fs from 'node:fs/promises';
import ora from 'ora';
import { RESOLUTIONS } from './constants/image.constants';
import { ANIMATION_DELAY_MS, EMPTY_LENGTH, DEFAULT_HEIGHT } from './constants';
import sharp from 'sharp';

async function main(): Promise<void> {
  console.log('\n' + chalk.cyan.bold('================================'));
  console.log(chalk.magenta.bold('    🖼️  OPTIMIZADOR DE IMÁGENES'));
  console.log(chalk.cyan.bold('================================\n'));

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
        { name: '2160p - Alta calidad', value: RESOLUTIONS['2160p'] },
        { name: '900p - Calidad media', value: RESOLUTIONS['900p'] }
      ]
    }
  ]);

  console.log(chalk.blue(`Optimizando imágenes a ${resolution}p`));

  // Procesar cada imagen
  for (const imageFile of imageFiles) {
    const imagePath = path.join(imagesPath, imageFile);

    spinner = ora({
      text:
        chalk.blue(`Procesando `) + chalk.yellow(imageFile) + chalk.blue('...'),
      color: 'cyan'
    }).start();

    try {
      // Simular delay para la animación de optimización
      await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAY_MS));

      // Obtener metadatos de la imagen
      const metadata = await getMetadata(imagePath);

      // Determinar el lado más largo
      const isVertical =
        (metadata.height ?? DEFAULT_HEIGHT) >
        (metadata.width ?? DEFAULT_HEIGHT);
      const longestSide = isVertical ? metadata.height : metadata.width;

      // Crear nombre para la imagen optimizada
      const fileNameWithoutExt = imageFile.replace(/\.[^/.]+$/, '');
      const optimizedName = `optimized-${resolution}-${fileNameWithoutExt}.jpg`;
      const outputPath = path.join(imagesPath, optimizedName);

      // Redimensionar y optimizar la imagen
      await resizeImage({
        inputPath: imagePath,
        outputPath,
        targetResolution: resolution,
        originalResolution: longestSide ?? DEFAULT_HEIGHT,
        isVertical
      });

      spinner.succeed(chalk.green(`✨ ${imageFile} optimizada correctamente`));
    } catch (error) {
      spinner.fail(chalk.red(`Error procesando ${imageFile}`));
      console.error(`Error en ${imageFile}:`, error);
    }
  }

  // Preguntar si desea eliminar las originales
  const { deleteOriginals } = await inquirer.prompt<{
    deleteOriginals: boolean;
  }>([
    {
      type: 'confirm',
      name: 'deleteOriginals',
      message: '¿Deseas eliminar las imágenes originales?',
      default: false
    }
  ]);

  if (deleteOriginals) {
    spinner = ora({
      text: chalk.blue('Eliminando imágenes originales...'),
      color: 'cyan'
    }).start();

    try {
      // Limpiar la caché de Sharp antes de empezar
      sharp.cache(false);

      // Simular delay para la animación
      await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAY_MS));

      for (const imageFile of imageFiles) {
        const imagePath = path.join(imagesPath, imageFile);
        await fs.unlink(imagePath);
      }

      spinner.succeed(
        chalk.green('Imágenes originales eliminadas correctamente')
      );
    } catch (error) {
      spinner.fail(chalk.red('Error al eliminar las imágenes originales'));
      console.error('Error:', error);
    }
  }

  console.log(chalk.green.bold('\n¡Proceso completado! 🎉'));
}

main().catch((error) => {
  console.error('Error en la ejecución principal:', error);
});
