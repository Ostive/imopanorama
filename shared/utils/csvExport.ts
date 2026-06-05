/**
 * Utilitaires pour l'export de données en format CSV
 */

export interface CSVColumn<T = unknown> {
  key: string;
  label: string;
  format?: (value: T) => string;
}

/**
 * Convertit un tableau d'objets en format CSV
 */
export function convertToCSV<T>(data: T[], columns: CSVColumn[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  // En-têtes
  const headers = columns.map(col => `"${col.label}"`).join(',');
  
  // Lignes de données
  const rows = data.map(item => {
    return columns.map(col => {
      const value = (item as any)[col.key];
      
      // Appliquer le formatage si défini
      const formattedValue = col.format ? col.format(value) : value;
      
      // Échapper les guillemets et encapsuler dans des guillemets
      const escapedValue = String(formattedValue || '')
        .replace(/"/g, '""'); // Échapper les guillemets
      
      return `"${escapedValue}"`;
    }).join(',');
  });

  return [headers, ...rows].join('\n');
}

/**
 * Télécharge un fichier CSV
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Ajouter le BOM UTF-8 pour une meilleure compatibilité avec Excel
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csvContent;
  
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Formate une date pour l'export CSV
 */
export function formatDateForCSV(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  return dateObj.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formate un prix pour l'export CSV
 */
export function formatPriceForCSV(price: number | null | undefined): string {
  if (price === null || price === undefined) return '';
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MGA'
  }).format(price);
}

/**
 * Formate un statut pour l'export CSV
 */
export function formatStatusForCSV(status: string): string {
  const statusMap: Record<string, string> = {
    'AVAILABLE': 'Disponible',
    'RESERVED': 'Réservé',
    'SOLD': 'Vendu',
    'admin': 'Administrateur',
    'agent': 'Agent',
    'user': 'Utilisateur'
  };
  
  return statusMap[status] || status;
}

/**
 * Formate un booléen pour l'export CSV
 */
export function formatBooleanForCSV(value: boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  return value ? 'Oui' : 'Non';
}
