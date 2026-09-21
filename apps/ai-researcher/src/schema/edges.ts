import { z } from 'zod';
import type { SchemaDefinition } from '@agent-k/core/src/schema';

// 2. 关系：引文依赖边
export const CitationEdgeZodSchema = z.object({
  id: z.string(), // 唯一联合主键 (sourceId_targetId)
  sourceId: z.string(), // 发起引用的文献
  targetId: z.string(), // 被引用的文献
  
  // 业务核心：关系特征
  isImportant: z.boolean().default(false), // 是否是“重要影响的边” (核心业务逻辑)
  directionality: z.enum(['one-way', 'bi-directional', 'none']).default('none'), // 连线样式：单向光点流 / 双箭头 / 无特殊样式
  depth: z.number().int().default(1), // 发现深度（N度参考关系）
  
  // 预留的推导上下文（为什么重要，大模型的总结等）
  agentContext: z.string().optional(), 
  createdAt: z.number().default(0),
});

export type CitationEdgeEntity = z.infer<typeof CitationEdgeZodSchema>;

export const CitationEdgeSchema: SchemaDefinition<typeof CitationEdgeZodSchema> = {
  name: 'citation_edges',
  schema: CitationEdgeZodSchema,
  key: 'id',
  indexes: ['sourceId', 'targetId', 'isImportant'], // 支持基于是否重要来做快速过滤
};
