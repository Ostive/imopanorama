'use client'

import { useState } from 'react';
import { Faq } from '@/features/faqs/types/faqs.types';
import { m, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FaqItemProps {
  faq: Faq;
}

export default function FaqItem({ faq }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-300 ${isOpen
        ? 'bg-primary-50 dark:bg-primary-900/20 shadow-lg border-2 border-primary-200 dark:border-primary-700 -translate-y-1'
        : 'bg-card shadow-md border-2 border-transparent hover:shadow-lg'
      }`}>
      <button type="button"
        className={`flex justify-between items-center w-full px-6 py-5 text-left focus:outline-none transition-colors ${isOpen ? 'border-l-4 border-primary-500 dark:border-primary-400' : ''
          }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <h3 className={`text-lg font-semibold ${isOpen ? 'text-primary-700 dark:text-primary-400' : 'text-foreground'
          }`}>
          {faq.question}
        </h3>
        <m.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-2"
        >
          <ChevronDownIcon className={`h-6 w-6 ${isOpen ? 'text-primary-500 dark:text-primary-400' : 'text-muted-foreground'
            }`} />
        </m.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 prose max-w-none text-foreground leading-relaxed">
              {faq.answer.split('\n').map((line, index) => (
                <p key={`${index}-${line}`} className="mb-2 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
