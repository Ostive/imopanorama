'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { DocumentTextIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  ),
});

// Suppress console warnings from swagger-ui-react
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('UNSAFE_componentWillReceiveProps') ||
        args[0].includes('ModelCollapse'))
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-linear-to-br from-primary-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <DocumentTextIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                API Documentation
              </h1>
              <p className="mt-1 text-gray-600 font-medium">
                ImoPanorama REST API Reference
              </p>
            </div>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 font-semibold rounded-xl transition-all border border-gray-200 shadow-sm"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour au dashboard
          </Link>
        </motion.div>

        {/* Swagger UI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <SwaggerUI url="/swagger.json" />
        </motion.div>
      </div>
    </div>
  );
}
