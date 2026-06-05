import { APIRequestContext, expect, request as apiRequest, test } from '@playwright/test';

const runCrud = process.env.E2E_RUN_ADMIN_CRUD === 'true';
const adminEmail = process.env.E2E_ADMIN_EMAIL || 'admin@imopanorama.mg';
const adminPassword = process.env.E2E_ADMIN_PASSWORD || 'Admin123!';

function uniqueEmail() {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@example.test`;
}

async function signIn(context: APIRequestContext, email: string, password: string) {
  return context.post('/api/auth/sign-in/email', {
    data: { email, password },
  });
}

const propertyPayload = {
  title: `E2E Villa Ambatobe ${Date.now()}`,
  description: 'Annonce creee automatiquement par le test E2E API.',
  propertyType: 'VILLA',
  transactionType: 'SALE',
  location: 'Ambatobe',
  city: 'Antananarivo',
  country: 'MG',
  region: 'Analamanga',
  price: 750_000_000,
  currency: 'MGA',
  totalSize: 350,
  livingSize: 220,
  features: ['Jardin', 'Parking'],
  amenities: ['Eau', 'Electricite'],
  images: ['/images/properties/featured/property-1.jpg'],
  coverImage: '/images/properties/featured/property-1.jpg',
  status: 'DRAFT',
  isFeatured: false,
  isPublished: false,
  legalStatus: 'TITLED',
  documentStatus: 'PENDING',
  isVerified: false,
};

test.describe('auth and property API flow', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'API flow runs once; browser/device coverage is handled by smoke tests.');
  });

  test('registers and signs in a client through Better Auth', async ({ request }) => {
    const email = uniqueEmail();
    const password = 'Password123!';

    const register = await request.post('/api/auth/sign-up/email', {
      data: {
        email,
        password,
        name: 'Client E2E',
        firstName: 'Client',
        lastName: 'E2E',
      },
    });

    expect(register.status(), await register.text()).toBeLessThan(500);

    const loginContext = await apiRequest.newContext();
    const login = await signIn(loginContext, email, password);
    expect(login.status(), await login.text()).toBeLessThan(500);
  });

  test('client cannot create a property', async ({ request }) => {
    const email = uniqueEmail();
    const password = 'Password123!';

    await request.post('/api/auth/sign-up/email', {
      data: { email, password, name: 'Client E2E', firstName: 'Client', lastName: 'E2E' },
    });

    const clientContext = await apiRequest.newContext();
    await signIn(clientContext, email, password);

    const createProperty = await clientContext.post('/api/properties', { data: propertyPayload });
    expect([401, 403]).toContain(createProperty.status());
  });

  test('admin can create, read, update, and delete a property @crud', async ({ baseURL }) => {
    test.skip(!runCrud, 'Set E2E_RUN_ADMIN_CRUD=true and provide seeded admin credentials to run CRUD E2E.');

    const adminContext = await apiRequest.newContext({ baseURL });
    const login = await signIn(adminContext, adminEmail, adminPassword);
    expect(login.status(), await login.text()).toBe(200);

    const create = await adminContext.post('/api/properties', { data: propertyPayload });
    expect(create.status(), await create.text()).toBe(200);
    const created = await create.json();
    const propertyId = created.data?.id;
    expect(propertyId).toBeTruthy();

    const read = await adminContext.get(`/api/properties/${propertyId}`);
    expect(read.status(), await read.text()).toBe(200);

    const update = await adminContext.put(`/api/properties/${propertyId}`, {
      data: { title: `${propertyPayload.title} modifiee` },
    });
    expect(update.status(), await update.text()).toBe(200);

    const remove = await adminContext.delete(`/api/properties/${propertyId}`);
    expect(remove.status(), await remove.text()).toBe(200);

    await adminContext.dispose();
  });
});
