import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { useMultipleImages } from '../hooks/useMultipleImages';
import { ImageGallery } from './ImageGallery';
import { PhotoIcon } from '@heroicons/react/24/outline';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export interface MultipleImageUploaderHandle {
  /** Get files that haven't been uploaded yet */
  getPendingFiles: () => File[];
  /** Get URLs of images already on CDN */
  getExistingUrls: () => string[];
  /** Replace blob previews with real CDN URLs after upload */
  replacePendingWithUrls: (urls: string[]) => void;
}

interface MultipleImageUploaderProps {
  onImagesChange?: (imageUrls: string[]) => void;
  initialImages?: string[];
  maxImages?: number;
  className?: string;
}

export const MultipleImageUploader = forwardRef<MultipleImageUploaderHandle, MultipleImageUploaderProps>(({
  onImagesChange,
  initialImages = [],
  maxImages = 10,
  className = '',
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousPreviewUrlsRef = useRef<string[]>([]);
  const onImagesChangeRef = useRef(onImagesChange);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const {
    images,
    error,
    addImage,
    removeImage,
    getPendingFiles,
    getExistingUrls,
    replacePendingWithUrls,
    previewUrls,
  } = useMultipleImages({
    maxImages,
    initialImages,
  });

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getPendingFiles,
    getExistingUrls,
    replacePendingWithUrls,
  }), [getPendingFiles, getExistingUrls, replacePendingWithUrls]);

  // Keep the ref updated with the latest callback
  useEffect(() => {
    onImagesChangeRef.current = onImagesChange;
  }, [onImagesChange]);

  // Notify parent when preview urls change
  useEffect(() => {
    const hasChanged =
      previewUrls.length !== previousPreviewUrlsRef.current.length ||
      previewUrls.some((url, index) => url !== previousPreviewUrlsRef.current[index]);

    if (hasChanged && onImagesChangeRef.current) {
      previousPreviewUrlsRef.current = previewUrls;
      onImagesChangeRef.current(previewUrls);
    }
  }, [previewUrls]);

  // Validate and add files locally (no upload)
  const processFiles = useCallback((files: FileList | File[]) => {
    setValidationError(null);
    const fileArray = Array.from(files);
    const errors: string[] = [];

    for (const file of fileArray) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        errors.push(`"${file.name}" : format non supporté (JPG, PNG, WebP, AVIF uniquement)`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        errors.push(`"${file.name}" : ${sizeMB} Mo dépasse la limite de 10 Mo`);
        continue;
      }

      const added = addImage(file);
      if (!added) {
        errors.push(`Nombre maximum d'images atteint (${maxImages})`);
        break;
      }
    }

    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
    }
  }, [addImage, maxImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag & Drop
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleImageDelete = async (imageUrl: string, index: number) => {
    const imageToDelete = images[index];
    if (imageToDelete) {
      removeImage(imageToDelete.id);
    }
  };

  const handleAddClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        role="button"
        tabIndex={0}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleAddClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAddClick(); } }}
        className={`
          relative mb-4 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.01]'
            : 'border-border hover:border-primary-400 hover:bg-muted'
          }
          ${images.length >= maxImages ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          aria-label="Sélectionner des images"
          tabIndex={-1}
        />

        <div className="flex flex-col items-center gap-2 py-2">
          <PhotoIcon className={`h-10 w-10 ${isDragging ? 'text-primary-500' : 'text-muted-foreground'}`} />
          <div>
            <p className="text-sm font-medium text-foreground">
              {isDragging ? 'Déposez vos images ici' : 'Glissez-déposez vos images ici'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ou cliquez pour parcourir — JPG, PNG, WebP, AVIF — max 10 Mo/image
            </p>
          </div>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          {images.length} / {maxImages} images
        </div>
      </div>

      {/* Errors */}
      {(error || validationError) && (
        <p className="mb-3 text-sm text-red-600 dark:text-red-400">
          {validationError || error}
        </p>
      )}

      {/* Gallery */}
      <ImageGallery
        images={previewUrls}
        onDelete={handleImageDelete}
        loading={false}
        editable={true}
      />
    </div>
  );
});

MultipleImageUploader.displayName = 'MultipleImageUploader';
