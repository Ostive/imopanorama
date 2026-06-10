import { useState, useCallback } from 'react';

interface UseMultipleImagesOptions {
  maxImages?: number;
  initialImages?: string[];
}

const EMPTY_INITIAL_IMAGES: string[] = [];

export interface ImageItem {
  /** Display URL — either a CDN URL (existing) or a blob: URL (pending) */
  url: string;
  id: string;
  /** The local File object if not yet uploaded */
  file?: File;
  /** True if this image already exists on the CDN */
  isExisting: boolean;
}

const generateId = () =>
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export function useMultipleImages(options: UseMultipleImagesOptions = {}) {
  const {
    maxImages = 10,
    initialImages = EMPTY_INITIAL_IMAGES,
  } = options;

  const [images, setImages] = useState<ImageItem[]>(() =>
    initialImages.map(url => ({ url, id: generateId(), isExisting: true }))
  );
  const [error, setError] = useState<string | null>(null);

  /**
   * Add a local file (no upload happens here — just stores it for preview)
   */
  const addImage = useCallback((file: File): boolean => {
    if (images.length >= maxImages) {
      setError(`Vous ne pouvez pas ajouter plus de ${maxImages} images.`);
      return false;
    }

    const previewUrl = URL.createObjectURL(file);
    setImages(prev => [
      ...prev,
      { url: previewUrl, id: generateId(), file, isExisting: false },
    ]);
    setError(null);
    return true;
  }, [images.length, maxImages]);

  /**
   * Remove an image from the list (does NOT delete from CDN — that's the caller's job)
   */
  const removeImage = useCallback((imageId: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === imageId);
      // Revoke blob URL to free memory
      if (img && !img.isExisting && img.url.startsWith('blob:')) {
        URL.revokeObjectURL(img.url);
      }
      return prev.filter(i => i.id !== imageId);
    });
  }, []);

  /**
   * Get all pending (not yet uploaded) File objects
   */
  const getPendingFiles = useCallback((): File[] => {
    return images.flatMap(img => (!img.isExisting && img.file ? [img.file] : []));
  }, [images]);

  /**
   * Get all existing CDN URLs (already uploaded)
   */
  const getExistingUrls = useCallback((): string[] => {
    return images.flatMap(img => (img.isExisting ? [img.url] : []));
  }, [images]);

  /**
   * Replace pending blob URLs with real CDN URLs after upload.
   * `uploadedUrls` must be in the same order as `getPendingFiles()` returned them.
   */
  const replacePendingWithUrls = useCallback((uploadedUrls: string[]) => {
    setImages(prev => {
      let urlIndex = 0;
      return prev.map(img => {
        if (!img.isExisting && img.file && urlIndex < uploadedUrls.length) {
          // Revoke old blob URL
          if (img.url.startsWith('blob:')) {
            URL.revokeObjectURL(img.url);
          }
          const newUrl = uploadedUrls[urlIndex++];
          return { ...img, url: newUrl, file: undefined, isExisting: true };
        }
        return img;
      });
    });
  }, []);

  const resetImages = useCallback(() => {
    // Revoke all blob URLs
    images.forEach(img => {
      if (!img.isExisting && img.url.startsWith('blob:')) {
        URL.revokeObjectURL(img.url);
      }
    });
    setImages([]);
    setError(null);
  }, [images]);

  return {
    images,
    error,
    addImage,
    removeImage,
    getPendingFiles,
    getExistingUrls,
    replacePendingWithUrls,
    resetImages,
    /** All display URLs (mix of blob: and CDN URLs) for preview */
    previewUrls: images.map(img => img.url),
    /** True if there are files waiting to be uploaded */
    hasPendingFiles: images.some(img => !img.isExisting),
  };
}
