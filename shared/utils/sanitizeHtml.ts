const DANGEROUS_TAGS = /<\/?(script|style|iframe|object|embed|link|meta|base|form|input|button|textarea|select|option)[^>]*>/gi;
const EVENT_ATTRIBUTES = /\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const DANGEROUS_URLS = /\s+(href|src)\s*=\s*(['"])\s*(javascript:|data:text\/html|vbscript:)[^'"]*\2/gi;

function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';

  return html
    .replace(DANGEROUS_TAGS, '')
    .replace(EVENT_ATTRIBUTES, '')
    .replace(DANGEROUS_URLS, '')
    .replace(/\s+style\s*=\s*("[^"]*"|'[^']*')/gi, '');
}

export function stripHtmlToText(html: string | null | undefined): string {
  return sanitizeHtml(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}
