/**
 * @module api/faqs/categories
 * @description Returns the list of available FAQ categories.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Public | Fetch all FAQ categories             |
 */

import { NextResponse } from 'next/server';
import { faqsServerService } from '@/features/faqs/server/faqs.service';
import { withErrorHandler } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/faqs/categories
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async () => {
  const categories = await faqsServerService.getCategories();
  return NextResponse.json({ categories });
});
