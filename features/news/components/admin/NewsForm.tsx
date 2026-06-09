'use client';

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  XMarkIcon,
  PhotoIcon,
  CodeBracketIcon,
  EyeIcon,
  DocumentTextIcon,
  LinkIcon,
  FolderIcon,
  CalendarIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  TagIcon,
  ClipboardDocumentIcon,
  ArrowRightEndOnRectangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { MediaLibraryModal } from '@/features/upload/components/MediaLibraryModal';
import { sanitizeHtml } from '@/shared/utils/sanitizeHtml';
import toast from 'react-hot-toast';
import './NewsForm.css';

// Types pour les actualités
export type NewsFormData = {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  images: string[];
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
};

type NewsFormProps = {
  initialData?: NewsFormData;
  isEditing?: boolean;
};

const CATEGORIES = [
  { id: 'GENERAL', name: 'Général' },
  { id: 'IMMOBILIER', name: 'Immobilier' },
  { id: 'CONSTRUCTION', name: 'Construction' },
  { id: 'EVENEMENT', name: 'Événement' },
  { id: 'ENTREPRISE', name: 'Entreprise' },
];

export default function NewsForm({ initialData, isEditing = false }: NewsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false); // Modal d'aperçu
  const [rawHtmlContent, setRawHtmlContent] = useState(''); // Contenu HTML brut
  const [copiedImage, setCopiedImage] = useState<string | null>(null); // Pour le feedback de copie
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null); // Référence pour le textarea HTML
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  // Gérer la sélection depuis la bibliothèque
  const handleMediaLibrarySelect = (url: string) => {
    setFormData(prev => {
      // Éviter les doublons
      if (prev.images.includes(url)) return prev;

      return {
        ...prev,
        images: [...prev.images, url],
        // Définir comme couverture si c'est la première image ou s'il n'y en a pas
        coverImage: prev.coverImage || url
      };
    });
  };

  // État du formulaire
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    images: [],
    category: 'GENERAL',
    tags: [],
    isPublished: false,
    publishedAt: null,
  });

  // Initialiser le formulaire avec les données existantes si disponibles
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setRawHtmlContent(initialData.content);
    }
  }, [initialData]);

  // Générer un slug à partir du titre
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/--+/g, '-') // Éviter les tirets multiples
      .trim();
  };

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));

      // Générer automatiquement le slug à partir du titre
      if (name === 'title') {
        setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
      }
    }
  };

  // Gérer les changements dans l'éditeur de texte riche
  const handleEditorChange = (content: string) => {
    // Mettre à jour le contenu brut HTML
    setRawHtmlContent(content);

    // Mettre à jour le formData avec le contenu HTML
    setFormData(prev => ({ ...prev, content }));
  };

  // Gérer l'ajout d'un tag
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // Gérer la suppression d'un tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Gérer l'upload d'une image de couverture
  const handleCoverImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSubmitting(true);
      // Créer un FormData pour l'upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'news');

      // Envoyer la requête à l'API d'upload
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'upload de l\'image');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, coverImage: data.url }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'upload de l'image");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer l'upload d'images supplémentaires
  const handleImagesUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsSubmitting(true);
      // Créer un FormData pour l'upload multiple
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      formData.append('folder', 'news');

      // Envoyer la requête à l'API d'upload multiple
      const response = await fetch('/api/admin/upload', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'upload des images');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, images: [...prev.images, ...data.urls] }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'upload des images");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer la suppression d'une image
  const handleRemoveImage = async (imageUrl: string) => {
    // Si l'URL est une URL de BunnyCDN, on la supprime via l'API
    if (imageUrl.includes(process.env.NEXT_PUBLIC_BUNNYCDN_PULL_ZONE_URL || '')) {
      try {
        const response = await fetch(`/api/admin/upload?url=${encodeURIComponent(imageUrl)}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de la suppression de l\'image');
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression de l'image");
        return;
      }
    }

    // Dans tous les cas, on retire l'image de l'état local
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageUrl)
    }));
  };

  // Copier le code HTML de l'image
  const copyImageHtml = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const htmlCode = `<img src="${url}" alt="" class="w-full h-auto rounded-lg shadow-md my-6" />`;
    navigator.clipboard.writeText(htmlCode);
    setCopiedImage(url);
    setTimeout(() => setCopiedImage(null), 2000);
  };

  // Insérer l'image dans le contenu HTML
  const insertImageToContent = (url: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const htmlCode = `<img src="${url}" alt="" class="w-full h-auto rounded-lg shadow-md my-6" />`;

    if (contentTextareaRef.current) {
      const textarea = contentTextareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = rawHtmlContent || formData.content;

      const newText = text.substring(0, start) + htmlCode + text.substring(end);

      handleEditorChange(newText);
      toast.success('Image insérée dans le contenu !');
    } else {
      handleEditorChange((rawHtmlContent || formData.content) + '\n' + htmlCode);
      toast.success('Image ajoutée à la fin du contenu !');
    }
  };

  // Drag & Drop: start dragging an image
  const handleImageDragStart = (e: React.DragEvent, imageUrl: string) => {
    e.dataTransfer.setData('text/plain', imageUrl);
    e.dataTransfer.effectAllowed = 'copy';
    setIsDraggingImage(true);
  };

  // Drag & Drop: end dragging
  const handleImageDragEnd = () => {
    setIsDraggingImage(false);
  };

  // Drag & Drop: handle drop on textarea
  const handleEditorDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const imageUrl = e.dataTransfer.getData('text/plain');
    if (!imageUrl) return;
    const htmlCode = `<img src="${imageUrl}" alt="" class="w-full h-auto rounded-lg shadow-md my-6" />`;
    const textarea = e.currentTarget;
    const dropPos = textarea.selectionStart;
    const text = rawHtmlContent || formData.content;
    const newText = text.substring(0, dropPos) + htmlCode + text.substring(dropPos);
    handleEditorChange(newText);
    toast.success('Image glissée dans le contenu !');
  };

  // Drag & Drop: allow drop on textarea
  const handleEditorDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Vérifier que les champs obligatoires sont remplis
      if (!formData.title || !formData.content || !formData.slug) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Préparer les données à envoyer
      const dataToSend = {
        ...formData,
        publishedAt: formData.isPublished ? new Date().toISOString() : null,
      };

      // Déterminer l'URL et la méthode en fonction de si on édite ou crée
      const url = isEditing ? `/api/admin/news/${formData.id}` : '/api/admin/news';
      const method = isEditing ? 'PUT' : 'POST';

      // Envoyer les données à l'API
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Une erreur est survenue');
      }

      toast.success(isEditing ? 'Article mis à jour avec succès' : 'Article créé avec succès');
      setTimeout(() => router.push('/admin/news'), 1500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN - MAIN CONTENT */}
        <div className="lg:col-span-8 space-y-8">

          {/* Section: Informations de base */}
          <div className="bg-white rounded-2xl p-6 max-w-full overflow-hidden shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Contenu principal</h2>
                <p className="text-sm text-gray-500">Informations générales de l'article</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Titre */}
              <div>
                <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <PencilSquareIcon className="w-4 h-4 text-gray-700" />
                  Titre de l&apos;actualité *
                </label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Nouveau projet immobilier à Antananarivo"
                  className="text-base font-medium"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label htmlFor="slug" className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <LinkIcon className="w-4 h-4 text-gray-700" />
                  URL (Slug) *
                </label>
                <Input
                  type="text"
                  name="slug"
                  id="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="nouveau-projet-immobilier-antananarivo"
                  className="font-mono text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section: Contenu HTML */}
          <div className="bg-white rounded-2xl p-6 max-w-full overflow-hidden shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <CodeBracketIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Éditeur</h2>
                  <p className="text-sm text-gray-500">Rédigez votre article en HTML</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const prompt = `Agis comme un expert en rédaction web et immobilier. Rédige un article complet et engageant sur le sujet suivant : "[INSERER SUJET ICI]".
L'article doit être structuré avec des balises HTML sémantiques propres, prêtes à être intégrées dans un éditeur :
- Utilise <h2> pour les titres de section
- Utilise <h3> pour les sous-titres
- Utilise <p> pour les paragraphes
- Utilise <ul>/<li> pour les listes
- Utilise <strong> pour mettre en valeur les mots clés
- N'ajoute PAS de balises <html>, <head> ou <body>, ni de styles CSS inline.
- Le ton doit être professionnel, informatif et adapté au marché immobilier de Madagascar.`;
                    navigator.clipboard.writeText(prompt);
                    toast.success("Prompt copié ! Collez-le dans ChatGPT.");
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-all shadow-sm font-medium"
                >
                  <SparklesIcon className="h-4 w-4" />
                  Copier Prompt IA
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm font-medium"
                >
                  <EyeIcon className="h-4 w-4" />
                  Aperçu
                </button>
              </div>
            </div>

            <div className="relative">
              {isDraggingImage && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-indigo-500/10 border-2 border-dashed border-indigo-500 rounded-xl pointer-events-none">
                  <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-indigo-700 font-semibold text-sm">
                    Déposez l'image ici
                  </div>
                </div>
              )}
              <textarea
                ref={contentTextareaRef}
                id="html-editor"
                aria-label="Éditeur HTML"
                value={rawHtmlContent || formData.content}
                onChange={(e) => handleEditorChange(e.target.value)}
                onDrop={handleEditorDrop}
                onDragOver={handleEditorDragOver}
                onDragEnter={() => setIsDraggingImage(true)}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDraggingImage(false);
                }}
                className={`w-full h-[600px] font-mono text-sm p-4 bg-slate-900 text-green-400 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all leading-relaxed ${isDraggingImage ? 'border-indigo-500' : 'border-gray-300'}`}
                placeholder={'<div class="article-content">\n  <h1>Titre de l\'article</h1>\n  <p>Contenu de l\'article...</p>\n</div>'}
                required
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const exampleHtml = `<div class="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl border">
  <!-- Titre -->
  <h2 class="text-2xl font-bold text-gray-800 mb-4">📰 Actualité immobilière à Madagascar</h2>
  <h3 class="text-xl font-semibold text-primary-600 mb-6">Les étapes d'une vente immobilière</h3>

  <!-- Étapes -->
  <ol class="space-y-4 list-decimal list-inside text-gray-700">
    <li>
      <span class="font-semibold">Signature de la promesse de vente :</span> 
      L'acheteur et le vendeur s'accordent sur le prix et les conditions de la vente.
    </li>
    <li>
      <span class="font-semibold">Vérification des documents :</span> 
      Contrôle du titre foncier, certificat juridique et absence d'hypothèques.
    </li>
    <li>
      <span class="font-semibold">Paiement de l'acompte :</span> 
      Généralement entre 5% et 10% du prix de vente.
    </li>
  </ol>

  <!-- Info complémentaire -->
  <div class="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-xl">
    <p class="text-sm text-gray-600">
      ⚖️ En pratique à Madagascar, le rôle du notaire est central pour sécuriser la transaction.
    </p>
  </div>
</div>`;

                  setRawHtmlContent(exampleHtml);
                  setFormData(prev => ({ ...prev, content: exampleHtml }));
                }}
                className="inline-flex items-center px-3 py-1.5 border border-indigo-200 text-xs font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <div className="w-4 h-4 mr-1 flex items-center justify-center border border-indigo-300 rounded-full text-[10px] font-bold">?</div>
                Insérer un modèle
              </button>
            </div>
          </div>

          {/* Section: Galerie d'images */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <PhotoIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Médias</h2>
                  <p className="text-sm text-gray-500">Gérez les images de l&apos;article</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMediaLibrary(true)}
                  className="px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-100 transition-colors flex items-center border border-purple-100"
                >
                  <FolderIcon className="w-4 h-4 mr-2" />
                  Bibliothèque
                </button>
              </div>
            </div>

            <label htmlFor="images-upload" className="block border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer group">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <PhotoIcon className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Cliquer pour ajouter des images</p>
                <p className="text-xs text-gray-500">JPG, PNG (Max 10MB)</p>
              </div>
              <input
                id="images-upload"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImagesUpload}
              />
            </label>

            {formData.images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div
                    key={image}
                    role="button"
                    tabIndex={0}
                    draggable
                    onDragStart={(e) => handleImageDragStart(e, image)}
                    onDragEnd={handleImageDragEnd}
                    className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200 group cursor-grab active:cursor-grabbing"
                    onClick={() => setFormData(prev => ({ ...prev, coverImage: image }))}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFormData(prev => ({ ...prev, coverImage: image })); } }}
                  >
                    <Image
                      src={image}
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />

                    {/* Badge Cover */}
                    {formData.coverImage === image && (
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-purple-700 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-purple-100 flex items-center gap-1">
                        ★ Couverture
                      </div>
                    )}

                    {/* Actions Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={(e) => copyImageHtml(image, e)}
                          className="bg-white/90 hover:bg-white text-gray-700 p-1.5 rounded-lg shadow-sm backdrop-blur"
                          title="Copier HTML"
                        >
                          {copiedImage === image ? (
                            <CheckCircleIcon className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <ClipboardDocumentIcon className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => insertImageToContent(image, e)}
                          className="bg-white/90 hover:bg-white text-indigo-600 p-1.5 rounded-lg shadow-sm backdrop-blur"
                          title="Insérer dans l'éditeur"
                        >
                          <ArrowRightEndOnRectangleIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(image);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg shadow-sm transition-colors"
                        title="Supprimer"
                      >
                        <XMarkIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.images.length > 0 && (
              <p className="mt-3 text-xs text-gray-400 italic text-center">
                Glissez une image vers l'éditeur HTML pour l'insérer directement
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">

          {/* Status Box */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 sticky top-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.isPublished ? 'bg-green-100' : 'bg-gray-100'}`}>
                <CalendarIcon className={`w-5 h-5 ${formData.isPublished ? 'text-green-600' : 'text-gray-500'}`} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Publication</h2>
                <p className="text-xs text-gray-500">{formData.isPublished ? 'En ligne' : 'Brouillon'}</p>
              </div>
            </div>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-all mb-4">
              <span className="text-sm font-medium text-gray-700">Publié</span>
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </div>
            </label>

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Enregistrement...' : (
                  <><CheckCircleIcon className="w-5 h-5 mr-2" />{isEditing ? 'Mettre à jour' : 'Enregistrer'}</>
                )}
              </Button>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                <FolderIcon className="w-4 h-4 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900">Catégorie</h3>
            </div>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="w-4 h-4 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900">Extrait</h3>
            </div>
            <Textarea
              rows={4}
              value={formData.excerpt}
              onChange={handleChange}
              name="excerpt"
              placeholder="Court résumé pour le SEO et les cartes..."
              className="resize-none text-sm"
            />
            <p className="text-right text-xs text-gray-400 mt-1">{formData.excerpt.length} chars</p>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <TagIcon className="w-4 h-4 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900">Tags</h3>
            </div>

            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Ajouter..."
                className="flex-1 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>+</Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-600"><XMarkIcon className="w-3 h-3" /></button>
                </span>
              ))}
              {formData.tags.length === 0 && <span className="text-xs text-gray-400 italic">Aucun tag</span>}
            </div>
          </div>

        </div>
      </div>

      {/* Modal d'aperçu — vue client exacte */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50">
          {/* Floating close button */}
          <div className="fixed top-4 right-4 z-60 flex gap-2">
            <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <EyeIcon className="w-4 h-4" />
              Aperçu client
            </div>
            <button
              type="button"
              onClick={() => setShowPreviewModal(false)}
              className="bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 p-2.5 rounded-full transition-all"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Full page preview — exact client layout */}
          <div className="h-full overflow-y-auto bg-gray-50">
            {/* Hero section with cover image */}
            <div className="relative h-[35vh] md:h-[40vh] lg:h-[50vh]">
              {formData.coverImage ? (
                <Image
                  src={formData.coverImage}
                  alt={formData.title || 'Cover'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-gray-700 to-gray-900" />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
                <div className="container mx-auto px-4 pb-8 md:pb-12">
                  <div className="inline-flex items-center text-white bg-primary-600 px-4 py-2 rounded-full mb-4 text-sm">
                    ← Retour aux actualités
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl">
                    {formData.title || 'Titre de l\'article'}
                  </h1>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="container mx-auto px-4 py-6">
              <div className="max-w-6xl mx-auto">
                {/* Article metadata bar */}
                <div className="flex flex-wrap items-center gap-3 md:gap-5 text-sm text-gray-600 mb-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-1 text-primary-600" />
                    <span>{formData.publishedAt ? new Date(formData.publishedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center">
                    <TagIcon className="h-5 w-5 mr-1 text-primary-600" />
                    <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full">
                      {CATEGORIES.find(c => c.id === formData.category)?.name || formData.category}
                    </span>
                  </div>
                  <div className="flex items-center ml-auto">
                    <span className="flex items-center text-primary-600">
                      Partager
                    </span>
                  </div>
                </div>

                {/* Excerpt */}
                {formData.excerpt && (
                  <p className="text-lg text-gray-600 mb-6 italic border-l-4 border-primary-500 pl-4">
                    {formData.excerpt}
                  </p>
                )}

                {/* HTML Content — exactly as client renders it */}
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawHtmlContent || formData.content) }}
                />

                {/* Tags */}
                {formData.tags.length > 0 && (
                  <div className="mt-8 pt-5 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author section */}
                <div className="mt-8 pt-5 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl text-gray-400">👤</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">À propos de l&apos;auteur</h3>
                      <p className="text-gray-600">Équipe ImoPanorama</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </form >
  );
}
