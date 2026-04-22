import { useState } from 'react';

interface UseBunnyCdnOptions {
  directory?: string;
}

interface UploadResult {
  url: string;
  success: boolean;
  error?: string;
}

export function useBunnyCdn(options: UseBunnyCdnOptions = {}) {
  const { directory = '/images/' } = options;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload un fichier vers BunnyCDN
   * @param file Le fichier à uploader
   * @returns L'URL du fichier uploadé
   */
  const uploadFile = async (file: File): Promise<UploadResult> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      // Simuler la progression (le fetch ne donne pas la progression réelle)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);

      // Upload via l'API serveur sécurisée
      const form = new FormData();
      form.append('file', file);
      form.append('folder', directory);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error || 'Upload échoué');
      }
      const url = json.data.url as string;

      // Nettoyage et finalisation
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      return { url, success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'upload';
      setError(errorMessage);
      return { url: '', success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Supprime un fichier de BunnyCDN
   * @param fileUrl L'URL du fichier à supprimer
   * @returns true si la suppression a réussi
   */
  const deleteFile = async (fileUrl: string): Promise<boolean> => {
    try {
      setError(null);
      const params = new URLSearchParams({ path: fileUrl });
      const res = await fetch(`/api/upload?${params.toString()}`, { method: 'DELETE' });
      const json = await res.json();
      return res.ok && json.success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression';
      setError(errorMessage);
      return false;
    }
  };

  /**
   * Liste les fichiers dans un répertoire de BunnyCDN
   * @param path Le chemin du répertoire à lister
   * @returns La liste des fichiers
   */
  const listFiles = async (path: string = directory): Promise<any[]> => {
    try {
      setError(null);
      const params = new URLSearchParams({ path });
      const res = await fetch(`/api/upload?${params.toString()}`);
      if (res.status === 200) {
        const json = await res.json();
        return json.data || [];
      }
      if (res.status === 404) return [];
      throw new Error('Erreur lors de la récupération des fichiers');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des fichiers';
      setError(errorMessage);
      return [];
    }
  };

  return {
    uploadFile,
    deleteFile,
    listFiles,
    isUploading,
    uploadProgress,
    error,
  };
}
