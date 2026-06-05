'use client';

import React from 'react';
import { MediaLibrary } from '@/features/upload/components/MediaLibrary';

export default function ImagesLibraryPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-4rem)]">
        <MediaLibrary />
      </div>
    </div>
  );
}
