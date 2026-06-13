// Génère le fichier Excel template pour l'import de propriétés
// Usage: node scripts/generate-property-template.js

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// ─── Valeurs valides ──────────────────────────────────────────────────────────

const PROPERTY_TYPES = [
  'VILLA', 'HOUSE', 'APARTMENT', 'LAND', 'TERRAIN_RESIDENTIAL',
  'COMMERCIAL', 'OFFICE', 'WAREHOUSE', 'OTHER'
];

const TRANSACTION_TYPES = ['SALE', 'RENT'];

const STATUS_VALUES = ['AVAILABLE', 'SOLD', 'RENTED', 'PENDING', 'UNDER_OFFER'];

const CONDITIONS = ['NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_RENOVATION'];

const LEGAL_STATUS = ['TITLED', 'UNTITLED', 'IN_PROGRESS', 'DISPUTED'];

const DOC_STATUS = ['VERIFIED', 'PENDING', 'INCOMPLETE', 'NOT_VERIFIED'];

const FEATURES_DISPONIBLES = [
  'Piscine', 'Jardin', 'Garage', 'Parking', 'Sécurité 24/7', 'Gardien',
  'Vue panoramique', 'Vue mer', 'Balcon', 'Terrasse', 'Ascenseur',
  'Climatisation', 'Cheminée', 'Cave', 'Portail automatique',
  'Cuisine équipée', 'Dressing', 'Bureau', 'Salle de sport', 'Jacuzzi'
];

// ─── Colonnes du template ─────────────────────────────────────────────────────

const COLUMNS = [
  // Identification
  { key: 'reference',        label: 'Référence',              width: 20, example_terrain: 'TER-ANT-2024-001', example_villa: 'VIL-IVA-2024-001', note: 'Ex: TER-ANT-2024-001', required: true },
  { key: 'title',            label: 'Titre',                  width: 35, example_terrain: 'Terrain Résidentiel - Ambohimanarina', example_villa: 'Villa Moderne avec Piscine - Ivandry', note: '', required: true },
  { key: 'description',      label: 'Description',            width: 60, example_terrain: 'Grand terrain plat idéal pour construction résidentielle. Accès facile, quartier calme.', example_villa: 'Magnifique villa contemporaine de 350m² avec piscine, jardin paysager et vue panoramique.', note: 'Décrivez la propriété en détail', required: true },

  // Type & transaction
  { key: 'propertyType',     label: 'Type de bien',           width: 22, example_terrain: 'TERRAIN_RESIDENTIAL', example_villa: 'VILLA', note: PROPERTY_TYPES.join(' | '), required: true },
  { key: 'transactionType',  label: 'Type transaction',       width: 18, example_terrain: 'SALE', example_villa: 'SALE', note: 'SALE | RENT', required: true },
  { key: 'status',           label: 'Statut',                 width: 16, example_terrain: 'AVAILABLE', example_villa: 'AVAILABLE', note: STATUS_VALUES.join(' | '), required: false },

  // Prix
  { key: 'price',            label: 'Prix (Ariary)',          width: 18, example_terrain: 450000000, example_villa: 2025000000, note: 'En Ariary entier (ex: 450000000)', required: true },
  { key: 'pricePerM2',       label: 'Prix/m² (Ariary)',       width: 16, example_terrain: 450000, example_villa: 5785714, note: 'Optionnel - calculé auto si vide', required: false },

  // Localisation
  { key: 'address',          label: 'Adresse',                width: 30, example_terrain: 'Lot III B 12 Ambohimanarina', example_villa: 'Lot II K 45 Ivandry', note: 'Numéro de lot / rue', required: false },
  { key: 'fokontany',        label: 'Fokontany',              width: 20, example_terrain: 'Ambohimanarina', example_villa: 'Ivandry', note: 'Quartier précis', required: false },
  { key: 'location',         label: 'Location (quartier)',    width: 25, example_terrain: 'Ambohimanarina, Antananarivo', example_villa: 'Ivandry, Antananarivo', note: 'Affiché sur la carte', required: true },
  { key: 'city',             label: 'Ville',                  width: 18, example_terrain: 'Antananarivo', example_villa: 'Antananarivo', note: '', required: true },
  { key: 'region',           label: 'Région',                 width: 18, example_terrain: 'Analamanga', example_villa: 'Analamanga', note: '', required: false },
  { key: 'district',         label: 'District',               width: 22, example_terrain: 'Antananarivo Avaradrano', example_villa: 'Antananarivo Avaradrano', note: '', required: false },
  { key: 'commune',          label: 'Commune',                width: 18, example_terrain: 'Antananarivo', example_villa: 'Antananarivo', note: '', required: false },
  { key: 'zipCode',          label: 'Code postal',            width: 13, example_terrain: '101', example_villa: '101', note: '101 = Tana centre', required: false },
  { key: 'latitude',         label: 'Latitude (GPS)',         width: 16, example_terrain: -18.9234, example_villa: -18.8792, note: 'Ex: -18.8792', required: false },
  { key: 'longitude',        label: 'Longitude (GPS)',        width: 16, example_terrain: 47.5012, example_villa: 47.5079, note: 'Ex: 47.5079', required: false },

  // Surfaces
  { key: 'totalSize',        label: 'Surface totale (m²)',    width: 18, example_terrain: 1000, example_villa: 350, note: 'Surface bâtie ou terrain', required: true },
  { key: 'livingSize',       label: 'Surface habitable (m²)', width: 20, example_terrain: '', example_villa: 280, note: 'Laisser vide pour terrain', required: false },
  { key: 'landSize',         label: 'Terrain (m²)',           width: 16, example_terrain: 1000, example_villa: 800, note: 'Surface du terrain', required: false },

  // Caractéristiques
  { key: 'bedrooms',         label: 'Chambres',               width: 12, example_terrain: '', example_villa: 5, note: 'Laisser vide pour terrain', required: false },
  { key: 'bathrooms',        label: 'SDB',                    width: 10, example_terrain: '', example_villa: 4, note: '', required: false },
  { key: 'rooms',            label: 'Pièces total',           width: 14, example_terrain: '', example_villa: 8, note: '', required: false },
  { key: 'floors',           label: 'Étages',                 width: 10, example_terrain: '', example_villa: 2, note: '0 = RDC seul', required: false },
  { key: 'parkingSpaces',    label: 'Places parking',         width: 16, example_terrain: '', example_villa: 2, note: '', required: false },
  { key: 'yearBuilt',        label: 'Année construction',     width: 18, example_terrain: '', example_villa: 2020, note: 'Laisser vide pour terrain', required: false },
  { key: 'condition',        label: 'État',                   width: 18, example_terrain: '', example_villa: 'EXCELLENT', note: CONDITIONS.join(' | '), required: false },

  // Juridique
  { key: 'legalStatus',      label: 'Statut juridique',       width: 18, example_terrain: 'TITLED', example_villa: 'TITLED', note: LEGAL_STATUS.join(' | '), required: false },
  { key: 'documentStatus',   label: 'Statut documents',       width: 20, example_terrain: 'VERIFIED', example_villa: 'VERIFIED', note: DOC_STATUS.join(' | '), required: false },
  { key: 'energyClass',      label: 'Classe énergie',         width: 14, example_terrain: '', example_villa: 'B', note: 'A B C D E F G', required: false },

  // Équipements
  { key: 'features',         label: 'Équipements',            width: 45, example_terrain: 'Accès eau | Accès électricité | Clôture', example_villa: 'Piscine | Jardin | Garage | Sécurité 24/7 | Vue panoramique', note: 'Séparés par | (pipe)', required: false },
  { key: 'amenities',        label: 'Commodités détaillées',  width: 50, example_terrain: 'Route goudronnée | Réseau électrique | Réseau eau JIRAMA', example_villa: 'Piscine chauffée | Jardin paysager | Garage 2 voitures | Cuisine équipée', note: 'Séparés par | (pipe)', required: false },

  // Visibilité
  { key: 'isFeatured',       label: 'Bien mis en avant',      width: 16, example_terrain: 'NON', example_villa: 'OUI', note: 'OUI | NON', required: false },
  { key: 'isPublished',      label: 'Publié',                 width: 12, example_terrain: 'OUI', example_villa: 'OUI', note: 'OUI | NON', required: false },

  // Photos
  { key: 'dossier_photos',   label: '📁 Dossier Photos',      width: 30, example_terrain: 'terrain-ambohimanarina', example_villa: 'villa-ivandry', note: 'Nom du dossier dans public/images/properties/', required: true },
];

// ─── Couleurs & styles ────────────────────────────────────────────────────────

const COLORS = {
  header_bg:    '1B4F72',  // bleu foncé
  header_fg:    'FFFFFF',
  required_bg:  'EAF2FF',  // bleu très clair pour colonnes obligatoires
  optional_bg:  'FDFEFE',  // presque blanc pour optionnelles
  terrain_bg:   'E8F8F0',  // vert pâle pour exemple terrain
  villa_bg:     'FEF9E7',  // jaune pâle pour exemple villa
  notes_bg:     'F8F9FA',  // gris clair pour feuille notes
  section_bg:   '2C3E50',  // gris foncé pour en-têtes de section
  photos_bg:    'D35400',  // orange pour colonne photos (importante)
  photos_fg:    'FFFFFF',
};

// ─── Construction du workbook ─────────────────────────────────────────────────

const wb = XLSX.utils.book_new();

// ── Feuille 1 : Template de saisie ───────────────────────────────────────────

const wsData = [];

// Ligne 1 : titre de section
const titleRow = COLUMNS.map((_, i) => i === 0 ? '🏠 TEMPLATE IMPORT PROPRIÉTÉS — ImoPanorama' : '');
wsData.push(titleRow);

// Ligne 2 : obligatoire/optionnel
const reqRow = COLUMNS.map(col => col.required ? '✅ OBLIGATOIRE' : '○ optionnel');
wsData.push(reqRow);

// Ligne 3 : en-têtes colonnes
const headerRow = COLUMNS.map(col => col.label);
wsData.push(headerRow);

// Ligne 4 : notes / valeurs valides
const notesRow = COLUMNS.map(col => col.note);
wsData.push(notesRow);

// Ligne 5 : exemple terrain
const terrainRow = COLUMNS.map(col => col.example_terrain);
wsData.push(terrainRow);

// Ligne 6 : exemple villa
const villaRow = COLUMNS.map(col => col.example_villa);
wsData.push(villaRow);

// Lignes 7–57 : lignes vides pour saisie (50 propriétés)
for (let i = 0; i < 50; i++) {
  wsData.push(COLUMNS.map(() => ''));
}

const ws = XLSX.utils.aoa_to_sheet(wsData);

// Largeurs de colonnes
ws['!cols'] = COLUMNS.map(col => ({ wch: col.width }));

// Figer les 4 premières lignes + 1ère colonne
ws['!freeze'] = { xSplit: 1, ySplit: 4 };

// ── Feuille 2 : Valeurs de référence ─────────────────────────────────────────

const refData = [
  ['📋 VALEURS DE RÉFÉRENCE — ImoPanorama', '', ''],
  ['', '', ''],

  ['TYPES DE BIEN (propertyType)', '', 'Description'],
  ['VILLA', '', 'Villa'],
  ['HOUSE', '', 'Maison'],
  ['APARTMENT', '', 'Appartement'],
  ['LAND', '', 'Terrain non classifié'],
  ['TERRAIN_RESIDENTIAL', '', 'Terrain résidentiel'],
  ['COMMERCIAL', '', 'Local commercial'],
  ['OFFICE', '', 'Bureau'],
  ['WAREHOUSE', '', 'Entrepôt'],
  ['OTHER', '', 'Autre'],
  ['', '', ''],

  ['TRANSACTION (transactionType)', '', ''],
  ['SALE', '', 'Vente'],
  ['RENT', '', 'Location'],
  ['', '', ''],

  ['STATUT (status)', '', ''],
  ['AVAILABLE', '', 'Disponible'],
  ['SOLD', '', 'Vendu'],
  ['RENTED', '', 'Loué'],
  ['PENDING', '', 'En attente'],
  ['UNDER_OFFER', '', 'Offre en cours'],
  ['', '', ''],

  ['ÉTAT DU BIEN (condition)', '', ''],
  ['NEW', '', 'Neuf'],
  ['EXCELLENT', '', 'Excellent état'],
  ['GOOD', '', 'Bon état'],
  ['FAIR', '', 'État correct'],
  ['NEEDS_RENOVATION', '', 'À rénover'],
  ['', '', ''],

  ['STATUT JURIDIQUE (legalStatus)', '', ''],
  ['TITLED', '', 'Titre foncier'],
  ['UNTITLED', '', 'Sans titre foncier'],
  ['IN_PROGRESS', '', 'En cours de régularisation'],
  ['DISPUTED', '', 'Litige en cours'],
  ['', '', ''],

  ['STATUT DOCUMENTS (documentStatus)', '', ''],
  ['VERIFIED', '', 'Documents vérifiés'],
  ['PENDING', '', 'En attente de vérification'],
  ['INCOMPLETE', '', 'Documents incomplets'],
  ['NOT_VERIFIED', '', 'Non vérifié'],
  ['', '', ''],

  ['ÉQUIPEMENTS COURANTS (features / amenities)', '', ''],
  ...FEATURES_DISPONIBLES.map(f => [f, '', '']),
  ['', '', ''],

  ['📁 DOSSIER PHOTOS', '', ''],
  ['Placez vos photos dans :', '', 'public/images/properties/<nom_dossier>/'],
  ['Exemple terrain :', '', 'public/images/properties/terrain-ambohimanarina/'],
  ['Exemple villa :', '', 'public/images/properties/villa-ivandry/'],
  ['Formats acceptés :', '', '.jpg  .jpeg  .png  .webp'],
  ['Nommage conseillé :', '', '01.jpg  02.jpg  03.jpg  (dans l\'ordre d\'affichage)'],
  ['La 1ère image sera la photo de couverture', '', ''],
];

const wsRef = XLSX.utils.aoa_to_sheet(refData);
wsRef['!cols'] = [{ wch: 35 }, { wch: 5 }, { wch: 50 }];

// ── Feuille 3 : Instructions photos ──────────────────────────────────────────

const photoData = [
  ['📷 GUIDE — PHOTOS DE PROPRIÉTÉS', ''],
  ['', ''],
  ['ÉTAPE 1 — Créer le dossier', ''],
  ['Chemin :', 'public/images/properties/<nom_dossier>/'],
  ['Exemple terrain :', 'public/images/properties/terrain-ambohimanarina/'],
  ['Exemple villa :', 'public/images/properties/villa-ivandry/'],
  ['', ''],
  ['ÉTAPE 2 — Ajouter les photos', ''],
  ['Formats acceptés :', '.jpg  .jpeg  .png  .webp'],
  ['Nommage conseillé :', '01.jpg  02.jpg  03.jpg ... (dans l\'ordre d\'affichage)'],
  ['La 1ère image (01.jpg) sera la couverture', ''],
  ['Maximum recommandé :', '10 photos par bien'],
  ['', ''],
  ['ÉTAPE 3 — Remplir la colonne "📁 Dossier Photos" dans le template', ''],
  ['Ne mettre QUE le nom du dossier, pas le chemin complet', ''],
  ['✅ Correct :', 'terrain-ambohimanarina'],
  ['❌ Incorrect :', 'public/images/properties/terrain-ambohimanarina/'],
  ['', ''],
  ['EXEMPLES DE NOMS DE DOSSIERS', ''],
  ['Terrain à Ambohimanarina :', 'terrain-ambohimanarina'],
  ['Villa à Ivandry :', 'villa-ivandry'],
  ['Appartement à Ankorondrano :', 'appt-ankorondrano-f3'],
  ['Maison à Tamatave :', 'maison-tamatave-centre'],
  ['Local commercial à Analakely :', 'commercial-analakely'],
  ['', ''],
  ['PRIX — FORMAT', ''],
  ['Toujours en Ariary entier (pas en millions)', ''],
  ['✅ Correct :', '450000000  (450 millions)'],
  ['✅ Correct :', '2500000000  (2,5 milliards)'],
  ['❌ Incorrect :', '450  ou  450M'],
];

const wsPhoto = XLSX.utils.aoa_to_sheet(photoData);
wsPhoto['!cols'] = [{ wch: 40 }, { wch: 50 }];

// ── Ajout des feuilles au workbook ────────────────────────────────────────────

XLSX.utils.book_append_sheet(wb, ws,     '📋 Propriétés');
XLSX.utils.book_append_sheet(wb, wsRef,  '📚 Valeurs valides');
XLSX.utils.book_append_sheet(wb, wsPhoto,'📷 Guide photos');

// ── Sauvegarde ────────────────────────────────────────────────────────────────

const outputPath = path.join(__dirname, '..', 'public', 'template-import-proprietes.xlsx');
XLSX.writeFile(wb, outputPath);

console.log(`✅ Template généré : ${outputPath}`);
console.log(`   Colonnes : ${COLUMNS.length}`);
console.log(`   Lignes de saisie : 50`);
console.log(`   Feuilles : 3 (Propriétés, Valeurs valides, Guide photos)`);
