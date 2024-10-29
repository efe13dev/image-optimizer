import { existsSync } from 'node:fs';

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    return existsSync(filePath);
  } catch (error) {
    console.error('Error al verificar existencia:', error);
    return false;
  }
}
