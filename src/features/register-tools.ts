import type { McpToolContext } from '../types'
import * as dotenv from 'dotenv'
import { registerGetCompetitionsTool } from './competitions/tool'
import { registerGetDetailedEventsTool } from './detailed-events/tool'
import { registerGetEventsTool } from './events/tool'
import { registerGetHighlightedEventsTool } from './highlighted-events/tool'
import { registerGetLeagueFixtureTool } from './league-fixture/tool'

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
