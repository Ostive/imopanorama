'use client'

import { useFeaturedProperties } from '@/features/properties/hooks/useProperties';
import Link from 'next/link';

function RecentPropertiesSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="text-right">
              <div className="h-5 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecentProperties() {
  const { properties, loading } = useFeaturedProperties(5);

  if (loading) {
    return <RecentPropertiesSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Propriétés récentes</h3>
        <Link
          href="/admin/properties"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Voir toutes →
        </Link>
      </div>
      <div className="space-y-3">
        {properties.slice(0, 3).map((property) => (
          <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{property.title}</p>
              <p className="text-sm text-gray-600">{property.city}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-primary-600">{typeof property.price === 'number' ? property.price.toLocaleString() : property.price}€</p>
              <p className="text-sm text-gray-500">{property.totalSize} m²</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
