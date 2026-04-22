import { bunnyCdnConfig } from '@/shared/config/bunnycdn';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service pour gérer l'upload d'images vers BunnyCDN
 */
export class UploadService {
  /**
   * Télécharge une image vers BunnyCDN
   * @param file Buffer contenant les données de l'image
   * @param fileName Nom du fichier original
   * @param folder Dossier de destination (ex: 'news', 'terrains')
   * @returns URL de l'image téléchargée
   */
  static async uploadImage(
    file: Buffer,
    fileName: string,
    folder: string = 'uploads'
  ): Promise<string> {
    try {
      // Vérifier que la configuration est disponible
      if (!bunnyCdnConfig.apiKey || !bunnyCdnConfig.storageZoneName) {
        throw new Error('BunnyCDN configuration is missing');
      }

      // Générer un nom de fichier unique pour éviter les collisions
      const fileExtension = fileName.split('.').pop() || 'jpg';
      const uniqueFileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `/${folder}/${uniqueFileName}`;

      // Envoyer le fichier à BunnyCDN
      const response = await fetch(
        `https://${bunnyCdnConfig.hostname}/${bunnyCdnConfig.storageZoneName}${filePath}`,
        {
          method: 'PUT',
          headers: {
            'AccessKey': bunnyCdnConfig.apiKey,
            'Content-Type': 'application/octet-stream',
          },
          body: new Uint8Array(file),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload to BunnyCDN: ${errorText}`);
      }

      // Construire l'URL publique de l'image
      return `${bunnyCdnConfig.pullZoneUrl}${filePath}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Télécharge plusieurs images vers BunnyCDN
   * @param files Tableau de {buffer, fileName}
   * @param folder Dossier de destination
   * @returns Tableau d'URLs des images téléchargées
   */
  static async uploadMultipleImages(
    files: Array<{ buffer: Buffer; fileName: string }>,
    folder: string = 'uploads'
  ): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => 
        this.uploadImage(file.buffer, file.fileName, folder)
      );
      
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  }

  /**
   * Supprime une image de BunnyCDN
   * @param imageUrl URL complète de l'image à supprimer
   * @returns boolean indiquant si la suppression a réussi
   */
  static async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // Extraire le chemin relatif de l'URL complète
      const pullZoneUrl = bunnyCdnConfig.pullZoneUrl;
      if (!imageUrl.startsWith(pullZoneUrl)) {
        throw new Error('Invalid image URL format');
      }
      
      const relativePath = imageUrl.substring(pullZoneUrl.length);
      
      // Envoyer la requête de suppression à BunnyCDN
      const response = await fetch(
        `https://${bunnyCdnConfig.hostname}/${bunnyCdnConfig.storageZoneName}${relativePath}`,
        {
          method: 'DELETE',
          headers: {
            'AccessKey': bunnyCdnConfig.apiKey,
          },
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }
}
