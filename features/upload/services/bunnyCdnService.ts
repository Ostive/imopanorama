import { bunnyCdnConfig } from '@/shared/config/bunnycdn';
import { sanitizeStorageDirectory, sanitizeStoragePath } from '@/shared/utils/storagePath';

class BunnyCdnService {
  private storageZoneName: string;
  private apiKey: string;
  private hostname: string;
  private pullZoneUrl: string;

  constructor() {
    this.storageZoneName = bunnyCdnConfig.storageZoneName;
    this.apiKey = bunnyCdnConfig.apiKey;
    this.hostname = bunnyCdnConfig.hostname;
    this.pullZoneUrl = bunnyCdnConfig.pullZoneUrl;
  }

  /**
   * Télécharge un fichier vers BunnyCDN Storage
   * @param file Le fichier à télécharger
   * @param path Le chemin de destination dans la zone de stockage (ex: "/images/")
   * @returns L'URL du fichier téléchargé
   */
  async uploadFile(file: File, path: string = '/images/'): Promise<string> {
    try {
      // Vérifier que la configuration est valide
      this.validateConfig();

      // Générer un nom de fichier unique
      const fileName = this.generateUniqueFileName(file.name);
      const fullPath = `${sanitizeStorageDirectory(path)}${fileName}`.replace(/\/\//g, '/');
      
      // Créer l'URL de l'API BunnyCDN
      const apiUrl = `https://${this.hostname}/${this.storageZoneName}${fullPath}`;
      
      // Convertir le fichier en ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Envoyer le fichier à BunnyCDN
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'AccessKey': this.apiKey,
          'Content-Type': 'application/octet-stream',
        },
        body: arrayBuffer,
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de l'upload: ${response.status} ${response.statusText}`);
      }
      
      // Retourner l'URL complète du fichier
      return `${this.pullZoneUrl}${fullPath}`;
    } catch (error) {
      console.error('Erreur lors de l\'upload vers BunnyCDN:', error);
      throw error;
    }
  }

  /**
   * Supprime un fichier de BunnyCDN Storage
   * @param filePath Le chemin complet du fichier à supprimer
   * @returns true si la suppression a réussi ou si le fichier n'existait pas (404)
   */
  async deleteFile(filePath: string): Promise<boolean> {
    try {
      // Vérifier que la configuration est valide
      this.validateConfig();
      
      // Extraire le chemin relatif à partir de l'URL complète si nécessaire
      const relativePath = sanitizeStoragePath(this.extractRelativePath(filePath));
      
      // Créer l'URL de l'API BunnyCDN
      const apiUrl = `https://${this.hostname}/${this.storageZoneName}${relativePath}`;
      
      // Envoyer la requête de suppression à BunnyCDN
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'AccessKey': this.apiKey,
        },
      });
      
      // Considérer 404 (Not Found) comme un succès puisque le fichier n'existe pas de toute façon
      if (response.status === 404) {
        return true;
      }
      
      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier BunnyCDN:', error);
      // Ne pas interrompre le processus de suppression pour les erreurs de réseau
      return false;
    }
  }

  /**
   * Liste les fichiers dans un répertoire de BunnyCDN Storage
   * @param directory Le répertoire à lister
   * @returns La liste des fichiers dans le répertoire
   */
  async listFiles(directory: string = '/'): Promise<any[]> {
    try {
      // Vérifier que la configuration est valide
      this.validateConfig();
      
      // S'assurer que le chemin commence par un slash
      const path = sanitizeStorageDirectory(directory);
      
      // Créer l'URL de l'API BunnyCDN
      const apiUrl = `https://${this.hostname}/${this.storageZoneName}${path}`;
      
      // Envoyer la requête à BunnyCDN
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'AccessKey': this.apiKey,
        },
      });
      
      // Si le répertoire n'existe pas (404), retourner un tableau vide
      if (response.status === 404) {
        return [];
      }
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des fichiers: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des fichiers BunnyCDN:', error);
      // Si c'est une erreur 404, retourner un tableau vide au lieu de lancer une exception
      if (error instanceof Error && error.message.includes('404')) {
        return [];
      }
      throw error;
    }
  }
  
  /**
   * Crée un répertoire dans BunnyCDN Storage
   * @param directory Le répertoire à créer
   * @returns true si la création a réussi
   */
  async createDirectory(directory: string): Promise<boolean> {
    try {
      // Vérifier que la configuration est valide
      this.validateConfig();
      
      // S'assurer que le chemin commence par un slash et se termine par un slash
      const path = sanitizeStorageDirectory(directory);
      
      // Créer l'URL de l'API BunnyCDN
      const apiUrl = `https://${this.hostname}/${this.storageZoneName}${path}`;
      
      // Créer un fichier vide .keep pour créer le répertoire
      const response = await fetch(`${apiUrl}.keep`, {
        method: 'PUT',
        headers: {
          'AccessKey': this.apiKey,
          'Content-Type': 'application/octet-stream',
        },
        body: new Uint8Array(0),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la création du répertoire BunnyCDN:', error);
      throw error;
    }
  }

  /**
   * Supprime un répertoire et tout son contenu sur BunnyCDN
   * @param directory Chemin du répertoire à supprimer
   * @returns true si la suppression a réussi ou si le répertoire n'existait pas
   */
  async deleteDirectory(directory: string): Promise<boolean> {
    try {
      this.validateConfig();
      const path = sanitizeStorageDirectory(directory);
      
      // 1. Lister tous les fichiers et sous-répertoires
      try {
        const files = await this.listFiles(path);
        
        // 2. Supprimer récursivement tous les fichiers et sous-répertoires
        for (const file of files) {
          const filePath = `${path}${file.ObjectName}`;
          
          if (file.IsDirectory) {
            // Récursion pour les sous-répertoires
            await this.deleteDirectory(filePath);
          } else {
            // Supprimer le fichier
            await this.deleteFile(filePath);
          }
        }
      } catch (listError) {
        // Si le répertoire n'existe pas, considérer comme déjà supprimé
        return true;
      }
      
      // 3. Supprimer le fichier .keep s'il existe
      await this.deleteFile(`${path}.keep`);
      
      // 4. Essayer de supprimer le répertoire lui-même via l'API
      const apiUrl = `https://${this.hostname}/${this.storageZoneName}${path}`;
      try {
        const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: {
            'AccessKey': this.apiKey,
          },
        });
        
        // Considérer 404 comme un succès puisque le répertoire n'existe pas de toute façon
        if (response.status === 404) {
          return true;
        }
        
        return response.ok;
      } catch (deleteError) {
        console.error(`Erreur lors de la suppression du répertoire ${path}:`, deleteError);
        // Ne pas interrompre le processus global
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du répertoire BunnyCDN:', error);
      // Ne pas interrompre le processus global
      return false;
    }
  }

  /**
   * Génère un nom de fichier unique basé sur le nom original
   * @param originalName Le nom de fichier original
   * @returns Un nom de fichier unique
   */
  private generateUniqueFileName(originalName: string): string {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    
    return `${timestamp}-${randomString}.${extension}`;
  }

  /**
   * Extrait le chemin relatif à partir d'une URL complète
   * @param fullUrl L'URL complète du fichier
   * @returns Le chemin relatif du fichier
   */
  private extractRelativePath(fullUrl: string): string {
    // Si l'URL contient l'URL de la pull zone, extraire le chemin relatif
    if (this.pullZoneUrl && fullUrl.startsWith(this.pullZoneUrl)) {
      return fullUrl.replace(this.pullZoneUrl, '');
    }
    
    // Sinon, supposer que c'est déjà un chemin relatif
    return fullUrl.startsWith('/') ? fullUrl : `/${fullUrl}`;
  }

  /**
   * Valide que la configuration BunnyCDN est complète
   */
  private validateConfig(): void {
    if (!this.storageZoneName || !this.apiKey) {
      throw new Error('Configuration BunnyCDN incomplète. Veuillez vérifier vos variables d\'environnement.');
    }
  }
}

// Exporter une instance singleton du service
export const bunnyCdnService = new BunnyCdnService();
