import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const authRouteMocks = vi.hoisted(() => ({
  originalPost: vi.fn(),
  originalGet: vi.fn(),
}));

vi.mock('better-auth/next-js', () => ({
  toNextJsHandler: vi.fn(() => ({
    POST: authRouteMocks.originalPost,
    GET: authRouteMocks.originalGet,
  })),
}));

vi.mock('@/infrastructure/auth/auth-config', () => ({
  auth: {},
}));

vi.mock('@/infrastructure/database/prisma', () => ({
  prisma: {
    user: {
      update: vi.fn(),
    },
  },
}));

vi.mock('@/infrastructure/logger/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock('@/infrastructure/auth/auth-guard', () => ({
  requireAuth: vi.fn(),
  requireStaff: vi.fn(),
  requireAdmin: vi.fn(),
}));

vi.mock('@/infrastructure/cache', () => ({
  cached: vi.fn((_key: string, fetcher: () => Promise<unknown>) => fetcher()),
  invalidateCache: vi.fn(),
}));

vi.mock('@/infrastructure/middleware/rate-limit', () => ({
  rateLimit: vi.fn(async () => null),
}));

vi.mock('@/features/properties/server/properties.service', () => ({
  propertiesServerService: {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock('@/features/contacts/services/contactService', () => ({
  ContactService: {
    createContact: vi.fn(),
    getContacts: vi.fn(),
    updateCrm: vi.fn(),
    deleteContact: vi.fn(),
  },
}));

function jsonRequest(url: string, method: string, body?: unknown): NextRequest {
  return new NextRequest(url, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function routeContext(id: string) {
  return { params: Promise.resolve({ id }) };
}

const staffSession = {
  user: {
    id: 'agent-1',
    email: 'agent@imopanorama.mg',
    role: 'agent',
  },
};

const adminSession = {
  user: {
    id: 'admin-1',
    email: 'admin@imopanorama.mg',
    role: 'admin',
  },
};

const validPropertyPayload = {
  title: 'Villa familiale a Ambatobe',
  description: 'Villa familiale avec jardin et acces rapide aux commodites.',
  propertyType: 'VILLA',
  transactionType: 'SALE',
  location: 'Ambatobe, Antananarivo',
  city: 'Antananarivo',
  country: 'MG',
  region: 'Analamanga',
  price: 850_000_000,
  currency: 'MGA',
  totalSize: 420,
  livingSize: 260,
  features: ['Jardin', 'Parking'],
  amenities: ['Eau', 'Electricite'],
  images: ['/images/properties/featured/property-1.jpg'],
  coverImage: '/images/properties/featured/property-1.jpg',
  status: 'AVAILABLE',
  isFeatured: true,
  isPublished: true,
  legalStatus: 'TITLED',
  documentStatus: 'VERIFIED',
  isVerified: true,
};

describe('Critical API flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('auth route', () => {
    it('delegates registration requests to Better Auth', async () => {
      authRouteMocks.originalPost.mockResolvedValueOnce(NextResponse.json({ user: { id: 'client-1' } }, { status: 200 }));
      const { POST } = await import('@/app/api/auth/[...all]/route');

      const response = await POST(jsonRequest('http://localhost:3000/api/auth/sign-up/email', 'POST', {
        email: 'client@imopanorama.mg',
        password: 'Password123!',
        name: 'Client Test',
      }));

      expect(response.status).toBe(200);
      expect(authRouteMocks.originalPost).toHaveBeenCalledTimes(1);
    });

    it('updates lastLoginAt after a successful email sign-in', async () => {
      authRouteMocks.originalPost.mockResolvedValueOnce(NextResponse.json({ user: { id: 'client-1' } }, { status: 200 }));
      const { prisma } = await import('@/infrastructure/database/prisma');
      const { POST } = await import('@/app/api/auth/[...all]/route');

      const response = await POST(jsonRequest('http://localhost:3000/api/auth/sign-in/email', 'POST', {
        email: 'client@imopanorama.mg',
        password: 'Password123!',
      }));

      expect(response.status).toBe(200);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: 'client@imopanorama.mg' },
        data: { lastLoginAt: expect.any(Date) },
      });
    });
  });

  describe('properties API', () => {
    it('allows staff to create a property and attaches the owner ID', async () => {
      const { requireStaff } = await import('@/infrastructure/auth/auth-guard');
      const { propertiesServerService } = await import('@/features/properties/server/properties.service');
      vi.mocked(requireStaff).mockResolvedValueOnce({ authorized: true, session: staffSession, errorResponse: undefined } as never);
      vi.mocked(propertiesServerService.create).mockResolvedValueOnce({ id: 'property-1', ...validPropertyPayload } as never);

      const { POST } = await import('@/app/api/properties/route');
      const response = await POST(jsonRequest('http://localhost:3000/api/properties', 'POST', validPropertyPayload));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(propertiesServerService.create).toHaveBeenCalledWith(expect.objectContaining({
        title: validPropertyPayload.title,
        ownerId: 'agent-1',
      }));
    });

    it('rejects anonymous property creation', async () => {
      const { requireStaff } = await import('@/infrastructure/auth/auth-guard');
      vi.mocked(requireStaff).mockResolvedValueOnce({
        authorized: false,
        session: null,
        errorResponse: NextResponse.json({ success: false, error: 'Non autorise' }, { status: 401 }),
      } as never);

      const { POST } = await import('@/app/api/properties/route');
      const response = await POST(jsonRequest('http://localhost:3000/api/properties', 'POST', validPropertyPayload));

      expect(response.status).toBe(401);
    });

    it('allows staff updates and admin deletion on a property', async () => {
      const { requireStaff, requireAdmin } = await import('@/infrastructure/auth/auth-guard');
      const { propertiesServerService } = await import('@/features/properties/server/properties.service');
      vi.mocked(requireStaff).mockResolvedValueOnce({ authorized: true, session: staffSession, errorResponse: undefined } as never);
      vi.mocked(requireAdmin).mockResolvedValueOnce({ authorized: true, session: adminSession, errorResponse: undefined } as never);
      vi.mocked(propertiesServerService.update).mockResolvedValueOnce({ id: 'property-1', ...validPropertyPayload, title: 'Titre modifie' } as never);
      vi.mocked(propertiesServerService.remove).mockResolvedValueOnce(true as never);

      const propertyRoute = await import('@/app/api/properties/[id]/route');
      const updateResponse = await propertyRoute.PUT(
        jsonRequest('http://localhost:3000/api/properties/property-1', 'PUT', { title: 'Titre modifie' }),
        routeContext('property-1'),
      );
      const deleteResponse = await propertyRoute.DELETE(
        jsonRequest('http://localhost:3000/api/properties/property-1', 'DELETE'),
        routeContext('property-1'),
      );

      expect(updateResponse.status).toBe(200);
      expect(deleteResponse.status).toBe(200);
      expect(propertiesServerService.update).toHaveBeenCalledWith('property-1', expect.objectContaining({ title: 'Titre modifie' }));
      expect(propertiesServerService.remove).toHaveBeenCalledWith('property-1');
    });
  });

  describe('contacts API', () => {
    it('allows public contact submission and keeps the route rate-limited', async () => {
      const { rateLimit } = await import('@/infrastructure/middleware/rate-limit');
      const { ContactService } = await import('@/features/contacts/services/contactService');
      vi.mocked(ContactService.createContact).mockResolvedValueOnce({
        id: 'contact-1',
        firstName: 'Lova',
        lastName: 'Rakoto',
        email: 'lova@example.com',
        message: 'Je souhaite organiser une visite cette semaine.',
      } as never);

      const { POST } = await import('@/app/api/contacts/route');
      const response = await POST(jsonRequest('http://localhost:3000/api/contacts', 'POST', {
        firstName: 'Lova',
        lastName: 'Rakoto',
        email: 'lova@example.com',
        phone: '+261341234567',
        message: 'Je souhaite organiser une visite cette semaine.',
        propertyId: 'property-1',
      }));

      expect(response.status).toBe(201);
      expect(rateLimit).toHaveBeenCalledWith(expect.any(NextRequest), expect.objectContaining({ scope: 'contacts:post' }));
      expect(ContactService.createContact).toHaveBeenCalledWith(expect.objectContaining({ propertyId: 'property-1' }));
    });

    it('allows admin CRM updates on a contact', async () => {
      const { requireAdmin } = await import('@/infrastructure/auth/auth-guard');
      const { ContactService } = await import('@/features/contacts/services/contactService');
      vi.mocked(requireAdmin).mockResolvedValueOnce({ authorized: true, session: adminSession, errorResponse: undefined } as never);
      vi.mocked(ContactService.updateCrm).mockResolvedValueOnce({ id: 'contact-1', leadStatus: 'VISIT_SCHEDULED' } as never);

      const { PATCH } = await import('@/app/api/contacts/[id]/route');
      const response = await PATCH(
        jsonRequest('http://localhost:3000/api/contacts/contact-1', 'PATCH', {
          leadStatus: 'VISIT_SCHEDULED',
          leadPriority: 'HIGH',
          scheduledVisitAt: '2026-06-15T10:00:00.000Z',
        }),
        routeContext('contact-1'),
      );

      expect(response.status).toBe(200);
      expect(ContactService.updateCrm).toHaveBeenCalledWith('contact-1', expect.objectContaining({
        leadStatus: 'VISIT_SCHEDULED',
        leadPriority: 'HIGH',
      }));
    });
  });
});
