import { DeviceType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../infrastructure/database/prisma';

const cities = ['Antananarivo', 'Toamasina', 'Mahajanga', 'Antsirabe', 'Fianarantsoa'];
const countries = ['Madagascar', 'France', 'Maurice', 'Réunion'];
const paths = ['/', '/proprietes', '/batipanorama', '/contact', '/actualites', '/login'];
const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
const os = ['Windows', 'MacOS', 'Linux', 'Android', 'iOS'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDevice(): DeviceType {
  const rand = Math.random();
  if (rand < 0.5) return DeviceType.MOBILE;
  if (rand < 0.9) return DeviceType.DESKTOP;
  return DeviceType.TABLET;
}

function getRandomDate(daysAgo: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(randomNumber(8, 20));
  date.setMinutes(randomNumber(0, 59));
  date.setSeconds(randomNumber(0, 59));
  return date;
}

async function seedAnalytics() {
  console.log('🌱 Seeding analytics data...');

  const sessionsToCreate = 100;
  const eventsToCreate = 50;

  // Create sessions with page views
  await Promise.all(Array.from({ length: sessionsToCreate }, async (_, i) => {
    const sessionId = uuidv4();
    const daysAgo = randomNumber(0, 7);
    const sessionDate = getRandomDate(daysAgo);
    const device = randomDevice();
    const country = randomItem(countries);
    const city = randomItem(cities);
    const browser = randomItem(browsers);
    const osType = randomItem(os);
    const pageViewCount = randomNumber(1, 5);
    const duration = randomNumber(30, 600); // 30 seconds to 10 minutes

    // Create session
    await prisma.analyticsSession.create({
      data: {
        sessionId,
        country,
        city,
        device,
        browser,
        os: osType,
        referrer: Math.random() > 0.5 ? 'https://www.google.com' : '',
        entryPage: randomItem(paths),
        exitPage: randomItem(paths),
        pageViews: pageViewCount,
        duration,
        isActive: false,
        startedAt: sessionDate,
        lastActivityAt: new Date(sessionDate.getTime() + duration * 1000),
        endedAt: new Date(sessionDate.getTime() + duration * 1000),
      },
    });

    // Create page views for this session
    await Promise.all(Array.from({ length: pageViewCount }, (_, j) => {
      const path = randomItem(paths);
      const pageDate = new Date(sessionDate.getTime() + j * 60000); // 1 minute apart

      return prisma.pageView.create({
        data: {
          url: `http://localhost:3000${path}`,
          path,
          title: getPageTitle(path),
          referrer: j === 0 && Math.random() > 0.5 ? 'https://www.google.com' : undefined,
          sessionId,
          country,
          city,
          device,
          browser,
          os: osType,
          screenWidth: device === DeviceType.MOBILE ? 375 : device === DeviceType.TABLET ? 768 : 1920,
          duration: randomNumber(10, 120),
          createdAt: pageDate,
        },
      });
    }));

    if ((i + 1) % 10 === 0) {
      console.log(`  Created ${i + 1}/${sessionsToCreate} sessions...`);
    }
  }));

  // Create custom events
  const eventTypes = [
    { name: 'terrain_view', category: 'engagement' },
    { name: 'contact_submit', category: 'conversion' },
    { name: 'favorite_add', category: 'engagement' },
    { name: 'search', category: 'engagement' },
    { name: 'user_register', category: 'conversion' },
    { name: 'user_login', category: 'engagement' },
  ];

  await Promise.all(Array.from({ length: eventsToCreate }, async (_, i) => {
    const eventType = randomItem(eventTypes);
    const daysAgo = randomNumber(0, 7);
    const eventDate = getRandomDate(daysAgo);
    const sessionId = uuidv4();

    await prisma.event.create({
      data: {
        name: eventType.name,
        category: eventType.category,
        label: eventType.name === 'search' ? 'terrain antananarivo' : undefined,
        value: eventType.category === 'conversion' ? 1 : undefined,
        metadata: { city: randomItem(cities) },
        sessionId,
        path: randomItem(paths),
        createdAt: eventDate,
      },
    });

    if ((i + 1) % 10 === 0) {
      console.log(`  Created ${i + 1}/${eventsToCreate} events...`);
    }
  }));

  console.log('✅ Analytics data seeded successfully!');
  console.log(`  - ${sessionsToCreate} sessions created`);
  console.log(`  - ~${sessionsToCreate * 2.5} page views created (avg 2.5 per session)`);
  console.log(`  - ${eventsToCreate} events created`);
}

function getPageTitle(path: string): string {
  const titles: Record<string, string> = {
    '/': 'Accueil - ImoPanorama',
    '/proprietes': 'Liste des propriétés',
    '/batipanorama': 'BatiPanorama - Construction',
    '/contact': 'Contact',
    '/actualites': 'Actualités',
    '/login': 'Connexion',
  };
  return titles[path] || 'ImoPanorama';
}

seedAnalytics()
  .catch((e) => {
    console.error('❌ Error seeding analytics:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
