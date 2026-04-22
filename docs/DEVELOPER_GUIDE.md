# ImoPanorama Developer Guide

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Setup

1. **Clone and Install**
```bash
git clone <repository-url>
cd Imo
npm install
```

2. **Environment Configuration**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values
```

3. **Database Setup**
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

4. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
Imo/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/           # Admin routes
│   │   ├── api/               # API routes
│   │   └── ...                # Public pages
│   ├── components/            # Shared React components
│   ├── lib/                   # Core utilities
│   │   ├── prisma.ts         # Database client
│   │   ├── logger.ts         # Logging utility
│   │   └── email.ts          # Email service
│   ├── modules/              # Feature modules
│   │   ├── auth/             # Authentication
│   │   ├── properties/       # Property management
│   │   ├── users/            # User management
│   │   ├── contacts/         # Contact forms
│   │   └── ...
│   ├── shared/               # Shared utilities
│   │   ├── services/         # API services
│   │   ├── utils/            # Helper functions
│   │   └── types/            # Shared types
│   └── types/                # Global TypeScript types
├── prisma/                   # Database schema & migrations
├── public/                   # Static assets
└── docs/                     # Documentation
```

## Coding Standards

### TypeScript

**Always use proper types, never `any`:**
```typescript
// ❌ Bad
function processData(data: any) { }

// ✅ Good
function processData(data: User) { }
```

**Use type guards for error handling:**
```typescript
// ✅ Good
try {
  // code
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  logger.error('Operation failed', error);
}
```

**Define interfaces for complex objects:**
```typescript
interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
}
```

### React Components

**Use PascalCase for component files:**
```
UserCard.tsx  ✅
user-card.tsx ❌
```

**Prefer named exports:**
```typescript
export function UserCard() { }  // ✅
export default UserCard;        // ❌ (avoid)
```

**Use TypeScript for props:**
```typescript
interface UserCardProps {
  user: User;
  onEdit?: (id: string) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  // component code
}
```

### Styling

**Use Tailwind CSS:**
```tsx
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
</div>
```

**Use Shadcn UI components:**
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="lg">Click me</Button>
```

### State Management

**Use React Context for global state:**
```typescript
import { useAuth } from '@/modules/auth/context/AuthContext';

const { user, isAuthenticated } = useAuth();
```

**Use TanStack Query for data fetching:**
```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => userService.getAllUsers()
});
```

### Forms

**Use React Hook Form + Zod:**
```typescript
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema)
});
```

## Logging

**Use the centralized logger:**
```typescript
import { logger } from '@/lib/logger';

// Debug information (dev only)
logger.debug('Processing request', { userId, action });

// General information
logger.info('User created', { userId, email });

// Warnings
logger.warn('Rate limit approaching', { current, limit });

// Errors
logger.error('Failed to save user', error);

// API calls
logger.api('POST', '/api/users', 201, { userId });

// Database operations
logger.db('INSERT', 'users', { email });
```

## API Routes

### Structure

```typescript
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    // Your logic
    logger.api('GET', '/api/users', 200);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    logger.error('Failed to fetch users', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Authentication

**Protect routes with middleware:**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*']
};
```

**Check user roles:**
```typescript
import { authService } from '@/modules/auth/services/authService';

const user = authService.getCurrentUser();
if (!authService.hasRole(['admin', 'super_admin'])) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}
```

## Database

### Prisma Client

**Always use the shared instance:**
```typescript
import { prisma } from '@/lib/prisma';

const users = await prisma.user.findMany();
```

**Use proper types:**
```typescript
import { Prisma } from '@prisma/client';

const where: Prisma.UserWhereInput = {
  email: { contains: searchTerm }
};
```

### Migrations

```bash
# Create a new migration
npm run db:migrate:create

# Apply migrations
npm run db:migrate

# Reset database (caution!)
npm run db:reset
```

## Testing

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  it('renders user information', () => {
    const user = { id: '1', name: 'John Doe' };
    render(<UserCard user={user} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### API Tests

```typescript
import { POST } from './route';

describe('POST /api/users', () => {
  it('creates a new user', async () => {
    const request = new Request('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' })
    });
    
    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
```

## Common Tasks

### Adding a New Feature Module

1. Create module directory:
```bash
mkdir -p src/modules/feature-name/{components,services,hooks,types}
```

2. Define types:
```typescript
// src/modules/feature-name/types/index.ts
export interface Feature {
  id: string;
  name: string;
}
```

3. Create service:
```typescript
// src/modules/feature-name/services/featureService.ts
import { ApiService } from '@/shared/services/ApiService';

class FeatureService extends ApiService {
  async getAll(): Promise<Feature[]> {
    return this.get('/api/features');
  }
}

export const featureService = new FeatureService();
```

4. Create API route:
```typescript
// src/app/api/features/route.ts
export async function GET() {
  const features = await prisma.feature.findMany();
  return NextResponse.json({ success: true, data: features });
}
```

### Adding a New Page

1. Create page file:
```typescript
// src/app/feature/page.tsx
export default function FeaturePage() {
  return <div>Feature Page</div>;
}
```

2. Add to navigation (if needed):
```typescript
// src/components/Header.tsx
<Link href="/feature">Feature</Link>
```

## Troubleshooting

### Common Issues

**Prisma Client not generated:**
```bash
npm run prisma:generate
```

**Database connection error:**
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify credentials

**TypeScript errors:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install
```

**Build errors:**
```bash
# Check for type errors
npx tsc --noEmit

# Run linter
npm run lint
```

## Useful Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run start                  # Start production server

# Database
npm run prisma:studio          # Open Prisma Studio
npm run db:seed                # Seed database
npm run db:reset               # Reset database

# Code Quality
npm run lint                   # Run ESLint
npm run type-check             # Check TypeScript types

# Testing
npm test                       # Run tests
npm run test:watch             # Run tests in watch mode
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Getting Help

- Check existing documentation in `/docs`
- Review code examples in similar modules
- Ask team members
- Create an issue in the repository

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Update documentation
5. Submit a pull request

Follow the coding standards and ensure all tests pass before submitting.
