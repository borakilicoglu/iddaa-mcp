import type { McpToolContext } from '../types'
import * as dotenv from 'dotenv'
import { registerGetCompetitionsTool } from './get-competitions'
import { registerGetDetailedEventsTool } from './get-detailed-events'
import { registerGetEventsTool } from './get-events'
import { registerGetHighlightedEventsTool } from './get-highlighted-events'
import { registerGetLeagueFixtureTool } from './get-league-fixture'

dotenv.config()

export function registerMyTool(context: McpToolContext): void {
  registerGetCompetitionsTool(context)
  registerGetEventsTool(context)
  registerGetDetailedEventsTool(context)
  registerGetHighlightedEventsTool(context)
  registerGetLeagueFixtureTool(context)
}

export { registerGetCompetitionsTool }
export { registerGetEventsTool }
export { registerGetDetailedEventsTool }
export { registerGetHighlightedEventsTool }
export { registerGetLeagueFixtureTool }
