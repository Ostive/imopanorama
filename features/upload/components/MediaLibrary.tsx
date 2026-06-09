'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ImageGallery } from '@/features/upload/components/ImageGallery';
import { ImageUploader } from '@/features/upload/components/ImageUploader';
import { PageLoader } from '@/shared/components/ui/Loader';
import {
    FolderIcon,
    ArrowLeftIcon,
    PlusIcon,
    FolderPlusIcon,
    PhotoIcon,
    ServerIcon,
    MagnifyingGlassIcon,
    ViewColumnsIcon,
    Squares2X2Icon,
    TrashIcon,
    EllipsisHorizontalIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface BunnyCdnFile {
    Guid: string;
    StorageZoneName: string;
    Path: string;
    ObjectName: string;
    Length: number;
    LastChanged: string;
    IsDirectory: boolean;
    ServerId: number;
    UserId: string;
    DateCreated: string;
    StorageZoneId: number;
}

interface MediaLibraryProps {
    onSelect?: (url: string) => void;
    selectionMode?: boolean;
    initialPath?: string;
    className?: string;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
    onSelect,
    selectionMode = false,
    initialPath = '/images/',
    className = ''
}) => {
    const [currentPath, setCurrentPath] = useState<string>(initialPath);
    const [files, setFiles] = useState<BunnyCdnFile[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showUploader, setShowUploader] = useState<boolean>(false);
    const [newFolderName, setNewFolderName] = useState<string>('');
    const [showNewFolderInput, setShowNewFolderInput] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [fileToUpload, setFileToUpload] = useState<File | undefined>(undefined);
    const hiddenFileInputRef = useRef<HTMLInputElement>(null);

    const handleTriggerUpload = () => {
        if (hiddenFileInputRef.current) {
            hiddenFileInputRef.current.click();
        }
    };

    const handleHiddenFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFileToUpload(files[0]);
            setShowUploader(true);
            // Reset input so same file can be selected again if needed
            e.target.value = '';
        }
    };

    // Charger les fichiers du répertoire courant
    const loadFiles = useCallback(async (path: string = currentPath) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/admin/images?path=${encodeURIComponent(path)}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur serveur');
            }

            const data = await response.json();
            setFiles(data.files || []);
        } catch (err) {
            console.error('Erreur lors du chargement des fichiers:', err);
            setError('Impossible de charger les fichiers. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    }, [currentPath]);

    // Charger les fichiers au chargement de la page et lorsque le chemin change
    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    // Naviguer dans un dossier
    const navigateToFolder = (folder: BunnyCdnFile) => {
        const newPath = `${currentPath}${folder.ObjectName}/`;
        setCurrentPath(newPath);
    };

    // Revenir au dossier parent
    const navigateToParent = () => {
        if (currentPath === '/images/') return;

        const pathParts = currentPath.split('/').filter(Boolean);
        pathParts.pop(); // Supprimer le dernier dossier
        const newPath = pathParts.length ? `/${pathParts.join('/')}/` : '/images/';
        setCurrentPath(newPath);
    };

    // Supprimer un fichier
    const handleDeleteFile = async (imageUrl: string, index: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) return;

        try {
            const response = await fetch(`/api/admin/images?path=${encodeURIComponent(imageUrl)}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur serveur');
            }

            // Recharger les fichiers après la suppression
            loadFiles();
        } catch (err) {
            console.error('Erreur lors de la suppression du fichier:', err);
            setError('Impossible de supprimer le fichier. Veuillez réessayer.');
        }
    };

    // Créer un nouveau dossier
    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) {
            setError('Le nom du dossier ne peut pas être vide.');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const folderPath = `${currentPath}${newFolderName.trim()}`;

            const response = await fetch('/api/admin/images', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'createDirectory',
                    path: folderPath
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur serveur');
            }

            setNewFolderName('');
            setShowNewFolderInput(false);
            loadFiles();
        } catch (err) {
            console.error('Erreur lors de la création du dossier:', err);
            setError('Impossible de créer le dossier. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    // Gérer l'upload d'une nouvelle image
    const handleImageUploaded = (imageUrl: string) => {
        // Recharger les fichiers après l'upload
        loadFiles();
        setShowUploader(false);
    };

    // Filtrer les fichiers (dossiers et images) basé sur la recherche
    const filteredFiles = files.filter(file =>
        file.ObjectName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const folders = filteredFiles.filter(file => file.IsDirectory);

    const images = filteredFiles
        .filter(file => !file.IsDirectory)
        .map(file => {
            const baseUrl = process.env.NEXT_PUBLIC_BUNNYCDN_PULL_ZONE_URL;
            if (!baseUrl) {
                console.warn("NEXT_PUBLIC_BUNNYCDN_PULL_ZONE_URL is not defined");
                return '';
            }
            const path = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;
            const normalizedPath = path.endsWith('/') ? path : `${path}/`;
            return `${baseUrl}${normalizedPath}${file.ObjectName}`;
        })
        .filter(url => url !== '');

    // Générer le fil d'Ariane
    const generateBreadcrumb = () => {
        const pathParts = currentPath.split('/').filter(Boolean);

        return (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4 overflow-x-auto scrollbar-hide">
                <button type="button"
                    onClick={() => setCurrentPath('/images/')}
                    className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center transition-colors px-2 py-1 rounded-md hover:bg-muted"
                >
                    <FolderIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Racine</span>
                </button>

                {pathParts.map((part, index) => {
                    if (part === 'images') return null;
                    const path = `/${pathParts.slice(0, index + 1).join('/')}/`;

                    return (
                        <React.Fragment key={path}>
                            <span className="text-muted-foreground">/</span>
                            <button type="button"
                                onClick={() => setCurrentPath(path)}
                                className={`hover:text-primary-600 transistion-colors px-2 py-1 rounded-md hover:bg-muted ${index === pathParts.length - 1 ? 'font-semibold text-foreground bg-muted' : ''}`}
                            >
                                {part}
                            </button>
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    const totalSize = files.reduce((sum, file) => sum + (file.Length || 0), 0);
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* Header / Toolbar */}
            <div className={`${selectionMode ? 'mb-4' : 'bg-card rounded-xl shadow-sm border border-border p-4 mb-6'}`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {!selectionMode && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
                                <PhotoIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">Médiathèque</h1>
                                <p className="text-xs text-muted-foreground">{files.length} éléments • {formatBytes(totalSize)}</p>
                            </div>
                        </div>
                    )}

                    <div className={`flex items-center gap-3 flex-1 ${selectionMode ? 'w-full' : 'lg:justify-end w-full lg:w-auto'}`}>
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow shadow-sm"
                                placeholder="Rechercher un fichier..."
                                aria-label="Rechercher un fichier"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-muted rounded-lg p-1 border border-border h-[38px] items-center shrink-0">
                            <button type="button"
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-card shadow-sm text-primary-600' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Squares2X2Icon className="h-4 w-4" />
                            </button>
                            <button type="button"
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-card shadow-sm text-primary-600' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <ViewColumnsIcon className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 shrink-0">
                            {!selectionMode && (
                                <Link href="/admin" className="p-2 text-muted-foreground hover:bg-muted rounded-lg border border-transparent hover:border-border transition-colors">
                                    <ArrowLeftIcon className="h-5 w-5" />
                                </Link>
                            )}
                            <button type="button"
                                onClick={() => setShowNewFolderInput(!showNewFolderInput)}
                                className="p-2 text-foreground bg-card border border-border hover:bg-muted rounded-lg shadow-sm transition-all"
                                title="Nouveau dossier"
                            >
                                <FolderPlusIcon className="h-5 w-5" />
                            </button>

                            <input
                                type="file"
                                ref={hiddenFileInputRef}
                                onChange={handleHiddenFileChange}
                                className="hidden"
                                accept="image/*"
                                aria-label="Uploader une image"
                                tabIndex={-1}
                            />
                            <button type="button"
                                onClick={handleTriggerUpload}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-[1.02]"
                            >
                                <PlusIcon className="h-5 w-5" />
                                <span className="hidden sm:inline">{selectionMode ? 'Uploader' : 'Ajouter'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <m.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2"
                >
                    <ExclamationTriangleIcon className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                </m.div>
            )}

            <AnimatePresence>
                {showNewFolderInput && (
                    <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="flex items-center space-x-2 bg-muted p-4 rounded-xl border border-border mb-4 shadow-inner">
                            <FolderIcon className="w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                placeholder="Nom du nouveau dossier"
                                aria-label="Nom du nouveau dossier"
                                className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            />
                            <div className="flex gap-2">
                                <button type="button"
                                    onClick={handleCreateFolder}
                                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium shadow-sm"
                                >
                                    Créer
                                </button>
                                <button type="button"
                                    onClick={() => {
                                        setShowNewFolderInput(false);
                                        setNewFolderName('');
                                    }}
                                    className="px-3 py-2 bg-card border border-border hover:bg-muted text-foreground rounded-lg text-sm font-medium shadow-sm"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </m.div>
                )}

                {showUploader && (
                    <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-6"
                    >
                        <div className="bg-card border border-border p-4 rounded-xl shadow-sm relative">
                            <button type="button"
                                onClick={() => setShowUploader(false)}
                                className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                            >
                                <span className="sr-only">Fermer</span>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <div className="mt-2">
                                <ImageUploader
                                    onImageUploaded={handleImageUploaded}
                                    directory={currentPath}
                                    label="Cliquez ou déposez votre image ici pour l'uploader instantanément"
                                    initialFile={fileToUpload}
                                />
                            </div>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className={`${selectionMode ? 'bg-muted border border-border rounded-lg' : 'bg-card rounded-xl shadow-sm border border-border'} flex-1 flex flex-col min-h-0 overflow-hidden`}>
                {/* Fil d'Ariane Bar */}
                <div className="px-6 py-3 border-b border-border flex items-center justify-between bg-card">
                    {generateBreadcrumb()}
                    {currentPath !== '/images/' && (
                        <button type="button"
                            onClick={navigateToParent}
                            className="text-xs font-medium text-muted-foreground hover:text-primary-600 flex items-center bg-card px-2 py-1 rounded border border-border shadow-sm hover:shadow transition-all"
                        >
                            <ArrowLeftIcon className="h-3 w-3 mr-1" />
                            Retour
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                            <PageLoader text="Chargement de vos médias..." />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8 min-h-[300px]">
                            {/* Empty State */}
                            {folders.length === 0 && images.length === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                                        <FolderIcon className="w-10 h-10 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium text-foreground">Ce dossier est vide</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto mt-2">Commencez par ajouter des images ou créez un sous-dossier pour organiser vos fichiers.</p>
                                    <button type="button"
                                        onClick={handleTriggerUpload}
                                        className="mt-6 text-primary-600 hover:text-primary-700 font-medium hover:underline flex items-center gap-2 mx-auto"
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                        <span>Uploader un fichier maintenant</span>
                                    </button>
                                </div>
                            )}

                            {/* Dossiers Grid */}
                            {folders.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center">
                                        <FolderIcon className="w-4 h-4 mr-2" />
                                        Dossiers ({folders.length})
                                    </h3>
                                    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
                                        {folders.map((folder) => (
                                            <m.div
                                                key={folder.Guid}
                                                whileHover={{ scale: 1.02, backgroundColor: '#F9FAFB' }}
                                                onClick={() => navigateToFolder(folder)}
                                                className="cursor-pointer bg-card group hover:shadow-md border border-border hover:border-primary-200 p-3 rounded-xl flex flex-row items-center transition-all relative overflow-hidden"
                                            >
                                                <div className="flex-shrink-0 mr-3">
                                                    <FolderIcon className="h-10 w-10 text-yellow-400 group-hover:text-yellow-500 transition-colors drop-shadow-sm" />
                                                </div>
                                                <span className="flex-1 text-sm font-medium text-foreground group-hover:text-foreground text-left truncate" title={folder.ObjectName}>
                                                    {folder.ObjectName}
                                                </span>
                                            </m.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Images Grid */}
                            {images.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center">
                                        <PhotoIcon className="w-4 h-4 mr-2" />
                                        Images ({images.length})
                                    </h3>
                                    {/* Pas besoin de refaire la logique Grid/List ici car ImageGallery gère sa propre grille, 
                                        mais on pourrait passer une prop viewMode à ImageGallery si on voulait supporter le mode liste. 
                                        Pour l'instant, gardons la grille par défaut mais améliorée. */}
                                    <ImageGallery
                                        images={images}
                                        onDelete={handleDeleteFile}
                                        onImageClick={onSelect}
                                        editable={true}
                                        className={viewMode === 'list' ? 'bg-card rounded-lg' : ''} // Placeholder for list mode styling if added later
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};
