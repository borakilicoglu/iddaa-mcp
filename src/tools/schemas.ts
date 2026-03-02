import { z } from 'zod'

const idSchema = z.union([z.string(), z.number()])

export const competitionSchema = z.object({
  ec: z.number().optional(),
  i: idSchema,
  n: z.string(),
  si: z.string().optional(),
})

export const competitionsResponseSchema = z.object({
  data: z.array(competitionSchema),
})

export const outcomeSchema = z.object({
  n: z.string(),
  odd: z.number(),
})

export const eventMarketSchema = z.object({
  o: z.array(outcomeSchema).optional().default([]),
  sov: z.union([z.string(), z.number()]).optional(),
  st: z.number(),
  t: z.number(),
})

export const eventSchema = z.object({
  an: z.string(),
  ci: idSchema,
  d: z.number(),
  hn: z.string(),
  i: z.number(),
  m: z.array(eventMarketSchema).optional().default([]),
  mbc: z.number().optional().default(0),
})

export const eventsResponseSchema = z.object({
  data: z.object({
    events: z.array(eventSchema),
  }),
})

export const highlightedEventsResponseSchema = z.object({
  data: z.object({
    he: z.array(z.number()),
  }),
})

export const marketDefinitionSchema = z.object({
  d: z.string(),
  i: z.number(),
  il: z.boolean(),
  in: z.boolean(),
  mdv: z.number(),
  mlv: z.number(),
  mmdv: z.number(),
  mmlv: z.number(),
  mst: z.number(),
  mt: z.number(),
  n: z.string(),
  o: z.record(z.string(), z.string()).optional(),
  p: z.number(),
  st: z.number(),
})

export const marketConfigResponseSchema = z.object({
  data: z.object({
    m: z.record(z.string(), marketDefinitionSchema),
  }),
})

export type Competition = z.infer<typeof competitionSchema>
export type Event = z.infer<typeof eventSchema>
export type EventMarket = z.infer<typeof eventMarketSchema>
export type MarketDefinition = z.infer<typeof marketDefinitionSchema>
export type Outcome = z.infer<typeof outcomeSchema>
