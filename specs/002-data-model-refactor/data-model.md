# Data Model: Entrepreneurs App

This document defines the data model for the Entrepreneurs App, using Zod schemas as the single source of truth for validation and type generation.

## Entrepreneur

```typescript
import { z } from 'zod';

const SocialMediaSchema = z.object({
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
  facebook: z.string().url().optional(),
  tiktok: z.string().url().optional(),
  instagram: z.string().url().optional(),

});

const ContactSchema = z.object({
  email: z.string().email().optional(),
  telephone: z.string().regex(/^(7|9|0)[0-9]{7}$/, 'Invalid Togolese phone number').optional(),
});

export const EntrepreneurSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  contact: ContactSchema.optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens').min(1),
  address: z.string().optional(),
  personalWebsite: z.string().url().optional(),
  socialMedia: SocialMediaSchema.optional(),
});

export type Entrepreneur = z.infer<typeof EntrepreneurSchema>;
```

## Business

```typescript
import { z } from 'zod';

const LocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const ContactSchema = z.object({
  email: z.string().email().optional(),
  telephone: z.string().regex(/^(7|9|0)[0-9]{7}$/, 'Invalid Togolese phone number').optional(),
});

const SocialMediaSchema = z.object({
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
  facebook: z.string().url().optional(),
  tiktok: z.string().url().optional(),
  instagram: z.string().url().optional(),
});

export const BusinessSchema = z.object({
  id: z.string().uuid(),
  entrepreneurId: z.string().uuid(),
  name: z.string().min(1),
  location: LocationSchema.optional(),
  email: z.string().url().optional(),
  contact: ContactSchema.optional(),
  primaryBusinessArea: z.string().optional(),
  secondaryBusinessArea: z.string().optional(),
  socialMedia: SocialMediaSchema.optional(),
  registrationNumber: z.string().optional(),
  registrationDate: z.date().optional(),
  activityStartDate: z.date(),
  supportStartDate: z.date(),
});

export type Business = z.infer<typeof BusinessSchema>;
```
