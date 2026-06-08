import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxWidth?: string;
}

/**
 * Composant Modal réutilisable avec portail React
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = 'max-w-md'
}) => {
  // Empêcher le défilement du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Gérer la touche Escape pour fermer la modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Ne rien rendre si la modal n'est pas ouverte
  if (!isOpen) return null;

  // Utiliser createPortal pour rendre la modal à la racine du document
  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay de fond */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Centrage vertical */}
        <span 
          className="hidden sm:inline-block sm:align-middle sm:h-screen" 
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Contenu de la modal */}
        <div 
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${maxWidth} w-full`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
          onClick={e => e.stopPropagation()}
        >
          {/* En-tête avec titre et bouton de fermeture */}
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 
                className="text-lg font-semibold text-gray-900"
                id="modal-headline"
              >
                {title}
              </h3>
              <button type="button" 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full"
                aria-label="Fermer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Corps de la modal */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
