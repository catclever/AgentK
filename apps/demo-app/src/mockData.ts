import { store } from '@agent-k/core';
import { z } from 'zod';

// Define Schema
export const UserSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    name: { type: 'string' },
    role: { type: 'string' },
    email: { type: 'string' }
  },
  required: ['id', 'name', 'role']
} as const;

export const UserZodSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  email: z.string().email().optional()
});

export async function initMockData() {
  const db = await store.init();
  
  // Register Schema
  if (!db.collections.users) {
    await db.addCollections({
      users: {
        schema: UserSchema
      }
    });

    // Populate Data
    await db.users.bulkInsert([
      { id: 'u1', name: 'Alice Chen', role: 'Engineer', email: 'alice@agent-k.com' },
      { id: 'u2', name: 'Bob Smith', role: 'Designer', email: 'bob@agent-k.com' }
    ]);
  }
}
