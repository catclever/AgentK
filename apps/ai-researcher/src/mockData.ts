import { store, defineSchema } from '@agent-k/core';
import { z } from 'zod';
import { PaperSchema } from './schema/papers';
import { CitationEdgeSchema } from './schema/edges';

export const UserZodSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  email: z.string().email().optional()
});

export async function initMockData() {
  const userSchemaDef = defineSchema('users', UserZodSchema, 'id');

  let db;
  try {
    // 1. Follow Core Framework Schema Registration
    await store.register(userSchemaDef);
    await store.register(PaperSchema);
    await store.register(CitationEdgeSchema);

    // 2. Initialize Database
    db = await store.init();
  } catch (err: any) {
    if (err.message?.includes('DB6') || err.message?.includes('schema') || err.message?.includes('RxError')) {
      console.warn('[Agent K] Schema mismatch detected (DB6). Auto-resetting local database to recover...');
      await store.reset();
      
      // Retry registration and init after reset
      await store.register(userSchemaDef);
      await store.register(PaperSchema);
      await store.register(CitationEdgeSchema);
      db = await store.init();
    } else {
      throw err;
    }
  }
  
  // 3. Seed Users
  const existingUsers = await db.users.find().exec();
  if (existingUsers.length === 0) {
    await db.users.bulkInsert([
      { id: 'u1', name: 'Alice Chen', role: 'Engineer', email: 'alice@agent-k.com' },
      { id: 'u2', name: 'Bob Smith', role: 'Designer', email: 'bob@agent-k.com' }
    ]);
    console.log('[Agent K] Seeded mock data for: users');
  }
  
  // 4. Seed Papers and Edges
  const existingPapers = await db.papers.find().exec();
  if (existingPapers.length === 0) {
    const now = Date.now();
    await db.papers.bulkInsert([
      // Root Seed Paper
      { id: 'W1', title: 'Attention Is All You Need', authors: ['Vaswani', 'Shazeer'], year: 2017, citationCount: 50000, abstract: 'The Transformer model...', isFull: true, updatedAt: now },
      
      // 2 Important Citations
      { id: 'W2', title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: ['Devlin', 'Chang'], year: 2018, citationCount: 40000, abstract: 'We introduce BERT...', isFull: true, updatedAt: now },
      { id: 'W3', title: 'Language Models are Few-Shot Learners (GPT-3)', authors: ['Brown', 'Mann'], year: 2020, citationCount: 20000, abstract: 'Recent work...', isFull: true, updatedAt: now },
      
      // 3 Unimportant Citations
      { id: 'W4', title: 'Some minor optimization trick', authors: ['Smith', 'Doe'], year: 2019, citationCount: 15, abstract: 'An optimization...', isFull: false, updatedAt: now },
      { id: 'W5', title: 'Application of Transformers in niche field', authors: ['Johnson'], year: 2021, citationCount: 5, abstract: 'We apply...', isFull: false, updatedAt: now },
      { id: 'W6', title: 'A survey on something vaguely related', authors: ['Lee'], year: 2022, citationCount: 2, abstract: 'A survey...', isFull: false, updatedAt: now }
    ]);
    
    await db.citation_edges.bulkInsert([
      // W2 cites W1 (Important)
      { id: 'W2_W1', sourceId: 'W2', targetId: 'W1', isImportant: true, directionality: 'one-way', depth: 1, agentContext: 'Core architecture inspiration', createdAt: now },
      // W3 cites W1 (Important, bi-directional discussion)
      { id: 'W3_W1', sourceId: 'W3', targetId: 'W1', isImportant: true, directionality: 'bi-directional', depth: 1, agentContext: 'Fundamental basis', createdAt: now },
      
      // Unimportant citations
      { id: 'W4_W1', sourceId: 'W4', targetId: 'W1', isImportant: false, directionality: 'none', depth: 1, agentContext: 'Passing reference', createdAt: now },
      { id: 'W5_W1', sourceId: 'W5', targetId: 'W1', isImportant: false, directionality: 'none', depth: 1, agentContext: 'General context', createdAt: now },
      { id: 'W6_W1', sourceId: 'W6', targetId: 'W1', isImportant: false, directionality: 'none', depth: 1, agentContext: 'Background literature', createdAt: now },
    ]);
    console.log('[Agent K] Seeded mock data for: papers and citation_edges');
  }
}
