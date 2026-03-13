import { z } from 'zod'

export const localeSchema = z
  .enum(['tr', 'en'])
  .optional()
  .default('tr')
  .describe('Language for response text (default: tr)')

export const sportsbookFilterSchemas = {
  st: z.number().optional().describe('Sport type filter (default: 1)'),
  type: z.number().optional().describe('Event type filter (default: 0)'),
  version: z.number().optional().describe('API version (default: 0)'),
} as const

export const limitSchema = z
  .number()
  .optional()
  .describe('Limit number of results (default: 1000)')
