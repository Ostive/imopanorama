# Skeleton Loading System

This guide explains how to use the skeleton loading placeholders throughout the application.

## Overview

Skeleton placeholders provide a better user experience than loading spinners by showing the structure of content while it loads. This creates a smoother, more premium feel.

## Available Components

### 1. Base Skeleton Component

```tsx
import { Skeleton } from '@/shared/components/ui/skeleton'

<Skeleton className="h-4 w-full" />
<Skeleton className="h-8 w-3/4" />
```

### 2. PropertyCardSkeleton

Use for property card grids/lists:

```tsx
import { PropertyCardSkeleton } from '@/shared/components/loading'

{loading && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <PropertyCardSkeleton key={i} />
    ))}
  </div>
)}
```

### 3. PropertyDetailSkeleton

Use for property detail pages:

```tsx
import { PropertyDetailSkeleton } from '@/shared/components/loading'

{loading && <PropertyDetailSkeleton />}
```

### 4. TableSkeleton

Use for data tables:

```tsx
import { TableSkeleton } from '@/shared/components/loading'

{loading && <TableSkeleton rows={5} columns={7} />}
```

### 5. FormSkeleton

Use for form pages:

```tsx
import { FormSkeleton } from '@/shared/components/loading'

{loading && <FormSkeleton fields={6} />}
```

### 6. PageSkeleton

Use for generic page loading:

```tsx
import { PageSkeleton } from '@/shared/components/loading'

{loading && <PageSkeleton />}
```

## Usage Guidelines

### ✅ DO

- Use skeleton placeholders that match the actual content structure
- Keep skeleton animations subtle (default pulse animation)
- Match skeleton dimensions to actual content
- Use appropriate skeleton for the context (table, card, form, etc.)

### ❌ DON'T

- Use loading spinners (animate-spin)
- Create custom skeletons when a reusable one exists
- Make skeletons too different from actual content
- Use skeletons for very quick operations (<100ms)

## Migration from Spinners

Replace this:
```tsx
{loading && (
  <div className="flex justify-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
)}
```

With this:
```tsx
{loading && <TableSkeleton rows={5} columns={6} />}
```

## Custom Skeletons

For unique layouts, compose using the base Skeleton component:

```tsx
<div className="space-y-4">
  <Skeleton className="h-8 w-3/4" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-5/6" />
  <div className="flex gap-2">
    <Skeleton className="h-10 w-20" />
    <Skeleton className="h-10 w-20" />
  </div>
</div>
```

## File Locations

- Base component: `shared/components/ui/skeleton.tsx`
- Skeleton components: `shared/components/loading/`
- Exports: `shared/components/loading/index.ts`
