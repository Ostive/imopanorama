import { describe, it, expect } from 'vitest';

describe('Simple Test', () => {
  it('should pass basic math test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should verify test framework is working', () => {
    expect(true).toBe(true);
  });
});
