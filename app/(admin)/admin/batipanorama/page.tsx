'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/context/AuthContext';
import { 
  BuildingOffice2Icon,
  DocumentTextIcon,
  Square3Stack3DIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { AdminPageHeader, StatsCard, QuickAction } from '../components';

export default function BatiPanoramaPage() {
  const { user } = useAuth();
  const [projectsCount, setProjectsCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
  const [processCount, setProcessCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const [projectsRes, servicesRes, processRes] = await Promise.all([
        fetch('/api/bati-projects'),
        fetch('/api/bati-services'),
        fetch('/api/bati-process')
      ]);

      const [projectsData, servicesData, processData] = await Promise.all([
        projectsRes.json(),
        servicesRes.json(),
        processRes.json()
      ]);

      if (projectsData.success) setProjectsCount(projectsData.projects.length);
      if (servicesData.success) setServicesCount(servicesData.services.length);
      if (processData.success) setProcessCount(processData.steps.length);
    } catch (error) {
      console.error('Error fetching counts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/20 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminPageHeader
          icon={<BuildingOffice2Icon className="w-6 h-6 text-white" />}
          title="BatiPanorama"
          subtitle="Gérez vos projets de construction"
          showBackButton
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Projets"
            value={projectsCount.toString()}
            subtitle="Projets actifs"
            icon={<BuildingOffice2Icon className="w-7 h-7" />}
            color="#3b82f6"
          />
          <StatsCard
            title="Services"
            value={servicesCount.toString()}
            subtitle="Services offerts"
            icon={<Square3Stack3DIcon className="w-7 h-7" />}
            color="#8b5cf6"
          />
          <StatsCard
            title="Processus"
            value={processCount.toString()}
            subtitle="Étapes définies"
            icon={<DocumentTextIcon className="w-7 h-7" />}
            color="#10b981"
          />
          <StatsCard
            title="Demandes"
            value="0"
            subtitle="Contacts reçus"
            icon={<EnvelopeIcon className="w-7 h-7" />}
            color="#f59e0b"
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickAction
              title="Gérer projets"
              description="Voir tous les projets"
              icon={<BuildingOffice2Icon className="w-6 h-6" />}
              href="/admin/batipanorama/projects"
              color="#3b82f6"
            />
            <QuickAction
              title="Gérer services"
              description="Modifier les services"
              icon={<Square3Stack3DIcon className="w-6 h-6" />}
              href="/admin/batipanorama/services"
              color="#8b5cf6"
            />
            <QuickAction
              title="Gérer processus"
              description="Étapes de construction"
              icon={<DocumentTextIcon className="w-6 h-6" />}
              href="/admin/batipanorama/process"
              color="#10b981"
            />
            <QuickAction
              title="Demandes"
              description="Voir les contacts"
              icon={<EnvelopeIcon className="w-6 h-6" />}
              href="/admin/batipanorama/contacts"
              color="#f59e0b"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
