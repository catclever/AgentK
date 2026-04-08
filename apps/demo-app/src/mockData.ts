import { store, defineSchema } from '@agent-k/core';
import { z } from 'zod';

export const UserZodSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  email: z.string().email().optional()
});

export async function initMockData() {
  // 1. Follow Core Framework Schema Registration
  const userSchemaDef = defineSchema('users', UserZodSchema, 'id');
  await store.register(userSchemaDef);

  // 2. Initialize Database
  const db = await store.init();
  
  // 3. Seed data strictly if collection is empty, avoiding duplicate conflicts gracefully
  const existing = await db.users.find().exec();
  
  if (existing.length === 0) {
    await db.users.bulkInsert([
      { id: 'u1', name: 'Alice Chen', role: 'Engineer', email: 'alice@agent-k.com' },
      { id: 'u2', name: 'Bob Smith', role: 'Designer', email: 'bob@agent-k.com' }
    ]);
    console.log('[Agent K] Seeded mock data for: users');
  } else {
    console.log(`[Agent K] Collection users already has ${existing.length} records. Seeding skipped.`);
  }
}
