import React, { useState, useRef, useEffect, useCallback } from 'react';
import { bunnyCdnService } from '../services/bunnyCdnService';
import Image from 'next/image';
import { ButtonLoader } from '@/shared/components/ui/Loader';
import { XCircleIcon } from '@heroicons/react/24/outline';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  initialImage?: string;
  className?: string;
  directory?: string;
  allowRemove?: boolean;
  onImageRemoved?: () => void;
  label?: string;
  maxSizeMB?: number;
  initialFile?: File;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  initialImage,
  className = '',
  directory = '/images/',
  allowRemove = false,
  onImageRemoved,
  label = 'Cliquez pour sélectionner une image',
  maxSizeMB = 5,
  initialFile
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleManualFileUpload = useCallback(async (file: File) => {
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide.');
      return;
    }

    // Vérifier la taille du fichier (max configurable)
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`L'image est trop volumineuse. Taille maximale: ${maxSizeMB}MB.`);
      return;
    }

    // Créer une URL pour la prévisualisation
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setError(null);

    try {
      setIsUploading(true);

      // Upload du fichier vers BunnyCDN
      const imageUrl = await bunnyCdnService.uploadFile(file, directory);

      // Appeler le callback avec l'URL de l'image
      onImageUploaded(imageUrl);

      // Nettoyer l'URL de prévisualisation
      URL.revokeObjectURL(objectUrl);

      // Mettre à jour la prévisualisation avec l'URL réelle
      setPreviewUrl(imageUrl);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setError('Une erreur est survenue lors de l\'upload de l\'image.');
    } finally {
      setIsUploading(false);
    }
  }, [maxSizeMB, directory, onImageUploaded]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    await handleManualFileUpload(files[0]);
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!previewUrl || !onImageRemoved) return;

    try {
      setIsUploading(true);
      setError(null);

      // Si l'image est une URL BunnyCDN, on la supprime du serveur
      if (previewUrl.includes('b-cdn.net') || previewUrl.includes('storage.bunnycdn.com')) {
        await bunnyCdnService.deleteFile(previewUrl);
      }

      // Réinitialiser l'état
      setPreviewUrl(null);
      onImageRemoved();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Une erreur est survenue lors de la suppression de l\'image.');
    } finally {
      setIsUploading(false);
    }
  };

  // Process initialFile if provided
  useEffect(() => {
    if (initialFile && !previewUrl) {
      handleManualFileUpload(initialFile);
    }
  }, [initialFile, previewUrl, handleManualFileUpload]);

  // Auto-trigger file selection if requested
  useEffect(() => {
    // Only if no preview exists yet
    if (!previewUrl && fileInputRef.current && label.includes('ouvre')) {
      // Slightly hacky: we can't reliably programmatically open file dialogs on mount 
      // due to browser security policies (must be user gesture). 
      // So we can't fully fix "click again" without user gesture.
      // However, we can make the dropzone MORE obvious or change the UX flow to not hide it behind a button first.
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        disabled={isUploading}
        aria-label="Sélectionner une image"
        tabIndex={-1}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
        className="cursor-pointer border-2 border-dashed border-primary-300 bg-primary-50 rounded-xl p-8 flex flex-col items-center justify-center hover:border-primary-500 hover:bg-primary-100 transition-all duration-300 group"
        style={{ minHeight: '200px' }}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center">
            <ButtonLoader color="primary" />
            <p className="mt-4 text-sm font-medium text-primary-700 animate-pulse">Upload en cours...</p>
          </div>
        ) : previewUrl ? (
          <div className="relative w-full h-full min-h-[180px] group-hover:scale-[1.02] transition-transform duration-300">
            <Image
              src={previewUrl}
              alt="Aperçu de l&apos;image"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain rounded-lg shadow-sm"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-lg backdrop-blur-[2px]">
              <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full border border-white/20">Changer l&apos;image</span>
            </div>

            {allowRemove && onImageRemoved && (
              <button type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all transform hover:scale-110"
                title="Supprimer l'image"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-foreground mb-1">Cliquez pour uploader</p>
            <p className="text-sm text-muted-foreground max-w-xs">{label.replace('Cliquez ou déposez votre image ici pour l\'uploader instantanément', 'Supporte JPG, PNG, WEBP')}</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-3 text-center bg-red-50 py-2 rounded-lg border border-red-100">{error}</p>
      )}
    </div>
  );
};
