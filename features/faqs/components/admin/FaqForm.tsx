'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useFaqCategories } from '../../hooks/useFaqs';
import { useRouter } from 'next/navigation';

interface FaqFormData {
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  id?: string;
}

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

interface FaqFormProps {
  initialData?: FaqFormData;
  onSubmit: (data: FaqFormData) => Promise<void>;
  isSubmitting: boolean;
  colorPalette?: ColorPalette;
}

// Palettes prédéfinies
const DEFAULT_PALETTE: ColorPalette = {
  primary: 'primary',
  secondary: 'gray',
  accent: 'blue',
  text: 'gray',
  background: 'white'
};

const BLUE_PALETTE: ColorPalette = {
  primary: 'blue',
  secondary: 'indigo',
  accent: 'sky',
  text: 'gray',
  background: 'white'
};

const GREEN_PALETTE: ColorPalette = {
  primary: 'emerald',
  secondary: 'teal',
  accent: 'green',
  text: 'gray',
  background: 'white'
};

const PURPLE_PALETTE: ColorPalette = {
  primary: 'purple',
  secondary: 'violet',
  accent: 'fuchsia',
  text: 'gray',
  background: 'white'
};

export default function FaqForm({ initialData, onSubmit, isSubmitting, colorPalette = DEFAULT_PALETTE }: FaqFormProps) {
  const router = useRouter();
  const { categories: apiCategories } = useFaqCategories();
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  // Combiner les catégories de l'API avec les catégories personnalisées
  const categories = [...apiCategories, ...customCategories];
  
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Fermer le dropdown quand on clique ailleurs
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // État pour la palette de couleurs sélectionnée
  const [selectedPalette, setSelectedPalette] = useState<string>('default');
  
  // Déterminer la palette active en fonction de la sélection
  const activePalette = {
    'default': DEFAULT_PALETTE,
    'blue': BLUE_PALETTE,
    'green': GREEN_PALETTE,
    'purple': PURPLE_PALETTE
  }[selectedPalette] || DEFAULT_PALETTE;
  
  // Utiliser la palette sélectionnée ou celle fournie en props
  const currentPalette = colorPalette || activePalette;
  
  // Fonction pour changer la palette de couleurs
  const handlePaletteChange = (palette: string) => {
    setSelectedPalette(palette);
  };
  
  const [formData, setFormData] = useState<FaqFormData>({
    question: initialData?.question || '',
    answer: initialData?.answer || '',
    category: initialData?.category || 'general',
    order: initialData?.order || 0,
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleCategorySelect = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };
  
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const trimmedCategory = newCategory.trim();
      // Ajouter la nouvelle catégorie à la liste des catégories personnalisées
      setCustomCategories(prev => {
        // Vérifier si la catégorie existe déjà
        if (!prev.includes(trimmedCategory) && !apiCategories.includes(trimmedCategory)) {
          return [...prev, trimmedCategory];
        }
        return prev;
      });
      // Mettre à jour la catégorie dans le formulaire
      setFormData(prev => ({ ...prev, category: trimmedCategory }));
      // Fermer le champ d'ajout
      setNewCategory('');
      setShowNewCategoryInput(false);
      // Fermer le dropdown si ouvert
      setIsDropdownOpen(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sélecteur de palette de couleurs */}
      <div className="mb-6 p-4 border rounded-md bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Palette de couleurs</h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handlePaletteChange('default')}
            className={`px-3 py-1 rounded-md text-xs font-medium ${selectedPalette === 'default' ? 'bg-primary-100 text-primary-800 ring-2 ring-primary-500' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            Par défaut
          </button>
          <button
            type="button"
            onClick={() => handlePaletteChange('blue')}
            className={`px-3 py-1 rounded-md text-xs font-medium ${selectedPalette === 'blue' ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            Bleu
          </button>
          <button
            type="button"
            onClick={() => handlePaletteChange('green')}
            className={`px-3 py-1 rounded-md text-xs font-medium ${selectedPalette === 'green' ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            Vert
          </button>
          <button
            type="button"
            onClick={() => handlePaletteChange('purple')}
            className={`px-3 py-1 rounded-md text-xs font-medium ${selectedPalette === 'purple' ? 'bg-purple-100 text-purple-800 ring-2 ring-purple-500' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            Violet
          </button>
        </div>
      </div>
      {/* Question */}
      <div>
        <label htmlFor="question" className={`block text-sm font-medium text-${currentPalette.text}-700`}>
          Question <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="question"
          name="question"
          value={formData.question}
          onChange={handleChange}
          required
          className={`mt-1 block w-full px-3 py-2 border border-${currentPalette.secondary}-300 rounded-md shadow-sm focus:outline-none focus:ring-${currentPalette.accent}-500 focus:border-${currentPalette.accent}-500`}
          placeholder="Saisissez la question"
        />
      </div>
      
      {/* Réponse */}
      <div>
        <label htmlFor="answer" className={`block text-sm font-medium text-${currentPalette.text}-700`}>
          Réponse <span className="text-red-500">*</span>
        </label>
        <textarea
          id="answer"
          name="answer"
          value={formData.answer}
          onChange={handleChange}
          required
          rows={6}
          className={`mt-1 block w-full px-3 py-2 border border-${currentPalette.secondary}-300 rounded-md shadow-sm focus:outline-none focus:ring-${currentPalette.accent}-500 focus:border-${currentPalette.accent}-500`}
          placeholder="Saisissez la réponse détaillée"
        />
      </div>
      
      {/* Catégorie */}
      <div>
        <label htmlFor="category" className={`block text-sm font-medium text-${currentPalette.text}-700`}>
          Catégorie
        </label>
        <div className="mt-1 flex">
          {showNewCategoryInput ? (
            <div className="flex w-full">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className={`flex-grow px-3 py-2 border border-${currentPalette.secondary}-300 rounded-l-md shadow-sm focus:outline-none focus:ring-${currentPalette.primary}-500 focus:border-${currentPalette.primary}-500`}
                placeholder="Nouvelle catégorie"
                autoFocus
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-${currentPalette.primary}-600 hover:bg-${currentPalette.primary}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${currentPalette.primary}-500`}
              >
                Ajouter
              </button>
            </div>
          ) : (
            <div className="flex w-full">
              <div className="relative" style={{ minWidth: '200px', maxWidth: '300px' }} ref={dropdownRef}>
                <div 
                  className={`w-full px-3 py-2 border border-${currentPalette.secondary}-300 rounded-l-md shadow-sm focus:outline-none focus:ring-${currentPalette.primary}-500 focus:border-${currentPalette.primary}-500 cursor-pointer flex justify-between items-center`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{formData.category.charAt(0).toUpperCase() + formData.category.slice(1)}</span>
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                {isDropdownOpen && (
                  <div 
                    className={`absolute z-10 mt-1 w-full bg-${currentPalette.background} border border-${currentPalette.secondary}-300 rounded-md shadow-lg max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-${currentPalette.secondary}-300`}
                  >
                    <div 
                      className={`px-3 py-2 hover:bg-${currentPalette.primary}-50 cursor-pointer`}
                      onClick={() => {
                        handleCategorySelect('general');
                        setIsDropdownOpen(false);
                      }}
                    >
                      Général
                    </div>
                    {categories.filter((cat: string) => cat !== 'general').map((category: string) => (
                      <div 
                        key={category} 
                        className={`px-3 py-2 hover:bg-${currentPalette.primary}-50 cursor-pointer`}
                        onClick={() => {
                          handleCategorySelect(category);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowNewCategoryInput(true)}
                className={`whitespace-nowrap inline-flex items-center px-4 py-2 border border-${currentPalette.secondary}-300 text-sm font-medium rounded-r-md shadow-sm text-${currentPalette.text}-700 bg-${currentPalette.background} hover:bg-${currentPalette.secondary}-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${currentPalette.primary}-500`}
                style={{ minWidth: '100px' }}
              >
                Nouvelle
              </button>
            </div>
          )}
        </div>
        {categories.length > 5 && (
          <div className={`mt-2 max-h-24 overflow-y-auto p-2 bg-${currentPalette.secondary}-50 rounded-md scrollbar-thin scrollbar-thumb-${currentPalette.secondary}-300`}>
            <p className={`text-xs font-medium text-${currentPalette.text}-500 mb-1`}>Catégories disponibles:</p>
            <div className="flex flex-wrap gap-1">
              {categories.map((category) => (
                <span 
                  key={category} 
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${currentPalette.secondary}-100 text-${currentPalette.text}-800 cursor-pointer hover:bg-${currentPalette.primary}-100`}
                  onClick={() => setFormData(prev => ({ ...prev, category }))}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Ordre */}
      <div>
        <label htmlFor="order" className={`block text-sm font-medium text-${currentPalette.text}-700`}>
          Ordre d'affichage
        </label>
        <input
          type="number"
          id="order"
          name="order"
          value={formData.order}
          onChange={handleNumberChange}
          min="0"
          className={`mt-1 block w-full px-3 py-2 border border-${currentPalette.secondary}-300 rounded-md shadow-sm focus:outline-none focus:ring-${currentPalette.accent}-500 focus:border-${currentPalette.accent}-500`}
        />
        <p className={`mt-1 text-sm text-${currentPalette.text}-500`}>
          Les questions sont triées par ordre croissant (0 apparaît en premier)
        </p>
      </div>
      
      {/* Statut */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleCheckboxChange}
          className={`h-4 w-4 text-${currentPalette.accent}-600 focus:ring-${currentPalette.accent}-500 border-${currentPalette.secondary}-300 rounded`}
        />
        <label htmlFor="isActive" className={`ml-2 block text-sm text-${currentPalette.text}-900`}>
          Question active (visible sur le site)
        </label>
      </div>
      
      {/* Boutons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.push('/admin/faqs')}
          className={`px-4 py-2 border border-${currentPalette.secondary}-300 rounded-md shadow-sm text-sm font-medium text-${currentPalette.text}-700 bg-${currentPalette.background} hover:bg-${currentPalette.secondary}-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${currentPalette.primary}-500 transition-colors duration-200`}
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-${currentPalette.primary}-600 hover:bg-${currentPalette.primary}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${currentPalette.primary}-500 disabled:bg-${currentPalette.primary}-300 disabled:cursor-not-allowed transition-colors duration-200`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enregistrement...
            </>
          ) : (
            'Enregistrer'
          )}
        </button>
      </div>
    </form>
  );
}
