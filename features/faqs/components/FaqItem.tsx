'use client'

import { useState } from 'react';
import { Faq } from '@/features/faqs/types/faqs.types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FaqItemProps {
  faq: Faq;
}

export default function FaqItem({ faq }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-300 ${isOpen
        ? 'bg-primary-50 dark:bg-primary-900/20 shadow-lg border-2 border-primary-200 dark:border-primary-700 -translate-y-1'
        : 'bg-white dark:bg-gray-800 shadow-md border-2 border-transparent hover:shadow-lg'
      }`}>
      <button
        className={`flex justify-between items-center w-full px-6 py-5 text-left focus:outline-none transition-colors ${isOpen ? 'border-l-4 border-primary-500 dark:border-primary-400' : ''
          }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <h3 className={`text-lg font-semibold ${isOpen ? 'text-primary-700 dark:text-primary-400' : 'text-gray-900 dark:text-white'
          }`}>
          {faq.question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-2"
        >
          <ChevronDownIcon className={`h-6 w-6 ${isOpen ? 'text-primary-500 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
            }`} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className="px-6 pb-6 pt-2 prose max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\n/g, '<br>') }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
