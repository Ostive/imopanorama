import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatDate,
  formatDateShort,
  slugify,
  truncateText,
  validateEmail,
  validatePhone,
} from '@/shared/utils';

describe('formatPrice', () => {
  it('should format a price in EUR by default', () => {
    const result = formatPrice(450000);
    expect(result).toContain('450');
    expect(result).toContain('000');
  });

  it('should format with MGA currency', () => {
    const result = formatPrice(5000000, 'MGA');
    expect(result).toContain('5');
    expect(result).toContain('000');
  });

  it('should handle zero price', () => {
    const result = formatPrice(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('should handle negative prices', () => {
    const result = formatPrice(-100);
    expect(typeof result).toBe('string');
  });

  it('should handle large prices', () => {
    const result = formatPrice(999999999);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('formatDate', () => {
  it('should format a valid Date object', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date);
    expect(result).toContain('2024');
    expect(result).toContain('15');
  });

  it('should format a valid date string', () => {
    const result = formatDate('2024-06-20');
    expect(result).toContain('2024');
  });

  it('should return "Date non disponible" for null', () => {
    expect(formatDate(null)).toBe('Date non disponible');
  });

  it('should return "Date invalide" for an invalid date string', () => {
    const result = formatDate('not-a-date');
    expect(result).toBe('Date invalide');
  });

  it('should handle ISO string dates', () => {
    const result = formatDate('2024-01-01T00:00:00.000Z');
    expect(result).toContain('2024');
    expect(typeof result).toBe('string');
  });

  it('should contain month name in French', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date);
    expect(result).toMatch(/janvier|january/i);
  });
});

describe('formatDateShort', () => {
  it('should format a valid Date object in short format', () => {
    const date = new Date('2024-03-10');
    const result = formatDateShort(date);
    expect(result).toContain('2024');
    expect(result).toContain('10');
  });

  it('should return "Date non disponible" for null', () => {
    expect(formatDateShort(null)).toBe('Date non disponible');
  });

  it('should return "Date invalide" for an invalid string', () => {
    expect(formatDateShort('invalid')).toBe('Date invalide');
  });
});

describe('slugify', () => {
  it('should convert text to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should remove accents', () => {
    expect(slugify('café')).toBe('cafe');
    expect(slugify('Île-de-France')).toBe('ile-de-france');
  });

  it('should replace spaces with hyphens', () => {
    expect(slugify('belle maison moderne')).toBe('belle-maison-moderne');
  });

  it('should remove leading and trailing hyphens', () => {
    expect(slugify('  hello  ')).toBe('hello');
  });

  it('should handle multiple spaces', () => {
    expect(slugify('a  b  c')).toBe('a-b-c');
  });

  it('should handle special characters', () => {
    expect(slugify('Prix: 500.000€')).toBe('prix-500000');
  });

  it('should handle empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('should handle strings with only accented characters', () => {
    const result = slugify('été');
    expect(result).toBe('ete');
  });
});

describe('truncateText', () => {
  it('should not truncate text shorter than maxLength', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('should truncate text longer than maxLength with ellipsis', () => {
    const result = truncateText('Hello World', 5);
    expect(result).toContain('...');
    expect(result.length).toBeLessThanOrEqual(8); // 5 chars + '...'
  });

  it('should handle exact length', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });

  it('should handle empty string', () => {
    expect(truncateText('', 10)).toBe('');
  });

  it('should handle maxLength of 0', () => {
    const result = truncateText('Hello', 0);
    expect(result).toBe('...');
  });
});

describe('validateEmail', () => {
  it('should return true for valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.name+tag@domain.co.uk')).toBe(true);
    expect(validateEmail('user123@sub.domain.com')).toBe(true);
  });

  it('should return false for invalid email addresses', () => {
    expect(validateEmail('not-an-email')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('user@@domain.com')).toBe(false);
  });

  it('should return false for email with spaces', () => {
    expect(validateEmail('user @domain.com')).toBe(false);
  });
});

describe('validatePhone', () => {
  it('should return true for valid Madagascar phone numbers', () => {
    expect(validatePhone('+261341234567')).toBe(true);
    expect(validatePhone('261341234567')).toBe(true);
    expect(validatePhone('034123456')).toBe(true);
  });

  it('should return false for invalid phone numbers', () => {
    expect(validatePhone('123')).toBe(false);
    expect(validatePhone('')).toBe(false);
  });

  it('should handle phone numbers with spaces', () => {
    const result = validatePhone('+261 34 12 34 56');
    expect(typeof result).toBe('boolean');
  });
});
