'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BatiContactsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new location
    router.replace('/admin/contacts');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirection vers /admin/contacts...</p>
      </div>
    </div>
  );
}
