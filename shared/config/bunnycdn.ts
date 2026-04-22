// Configuration pour BunnyCDN Storage
export const bunnyCdnConfig = {
  // ATTENTION: Ne jamais exposer la clé API côté client.
  // Ces valeurs ne doivent être lues que côté serveur.
  storageZoneName: process.env.BUNNYCDN_STORAGE_ZONE_NAME || '',
  apiKey: process.env.BUNNYCDN_API_KEY || '',
  hostname: 'storage.bunnycdn.com',
  // Cette valeur peut être publique pour le client (CDN)
  pullZoneUrl:
    typeof window !== 'undefined'
      ? process.env.NEXT_PUBLIC_BUNNYCDN_PULL_ZONE_URL || ''
      : process.env.BUNNYCDN_PULL_ZONE_URL || process.env.NEXT_PUBLIC_BUNNYCDN_PULL_ZONE_URL || '',
};
