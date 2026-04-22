'use client'

import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export function QuickAction({ title, description, icon, href, color }: QuickActionProps) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="group block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100"
      >
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
            <div style={{ color }}>{icon}</div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
        </div>
      </motion.div>
    </Link>
  );
}
