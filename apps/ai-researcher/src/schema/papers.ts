import { z } from 'zod';
import type { SchemaDefinition } from '@agent-k/core/src/schema';

// 1. 实体：论文节点
export const PaperZodSchema = z.object({
  id: z.string(), // OpenAlex ID, e.g., 'W2740409395'
  title: z.string(),
  authors: z.array(z.string()),
  year: z.number().int(),
  citationCount: z.number().int().default(0),
  abstract: z.string().optional(),
  url: z.string().optional(),
  
  // 遵循 Snippet/Full 策略：批量抓取引用时只拿摘要 (false)，展开详情时补全全量 (true)
  isFull: z.boolean().default(true), 
  updatedAt: z.number().default(0),
});

export type PaperEntity = z.infer<typeof PaperZodSchema>;

export const PaperSchema: SchemaDefinition<typeof PaperZodSchema> = {
  name: 'papers', 
  schema: PaperZodSchema,
  key: 'id',
  indexes: ['year', 'citationCount'], 
};
