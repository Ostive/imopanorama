'use client'

import { motion } from 'framer-motion';
import {
  HomeModernIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

export function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-2xl shadow-lg p-6 border border-border"
    >
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <span className="text-2xl">🔔</span>
        Activité récente
      </h3>
      <div className="space-y-4">
        <motion.div
          whileHover={{ x: 5 }}
          className="flex items-start space-x-4 p-4 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-900/40"
        >
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <HomeModernIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              Nouveau terrain ajouté : <span className="text-green-600 dark:text-green-400">Villa Antananarivo</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">Il y a 2 heures</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ x: 5 }}
          className="flex items-start space-x-4 p-4 bg-linear-to-r from-primary-50 to-cyan-50 dark:from-primary-900/20 dark:to-cyan-900/20 rounded-xl border border-primary-100 dark:border-primary-900/40"
        >
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <UserGroupIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              Nouveau utilisateur inscrit : <span className="text-primary-600 dark:text-primary-400">Marie Rakoto</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">Il y a 4 heures</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ x: 5 }}
          className="flex items-start space-x-4 p-4 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-900/40"
        >
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              Nouveau message de contact reçu
            </p>
            <p className="text-xs text-muted-foreground mt-1">Il y a 6 heures</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
