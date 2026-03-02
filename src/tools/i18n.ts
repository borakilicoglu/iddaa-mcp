export type Locale = 'tr' | 'en'

interface Dictionary {
  competitionsNotFound: string
  competitionsTitle: (count: number) => string
  competitionEventLabel: string
  eventsNotFound: string
  eventsTitle: (count: number) => string
  highlightedNotFound: string
  highlightedTitle: (count: number) => string
  leagueLabel: string
  dateLabel: string
  oddsLabel: string
  noOdds: string
  unknownCompetition: string
  unknownMarket: string
}

const dictionaries: Record<Locale, Dictionary> = {
  tr: {
    competitionsNotFound: 'Müsabaka bulunamadı.',
    competitionsTitle: count => `Müsabakalar (${count}):`,
    competitionEventLabel: 'Etkinlik',
    eventsNotFound: 'Etkinlik bulunamadı.',
    eventsTitle: count => `Etkinlikler (${count}):`,
    highlightedNotFound: 'Öne çıkan etkinlik bulunamadı.',
    highlightedTitle: count => `Öne çıkan etkinlikler (${count}):`,
    leagueLabel: 'Lig',
    dateLabel: 'Tarih',
    oddsLabel: 'Oranlar',
    noOdds: 'Oran bilgisi yok.',
    unknownCompetition: 'Bilinmeyen Lig',
    unknownMarket: 'Bilinmeyen Market',
  },
  en: {
    competitionsNotFound: 'No competitions found.',
    competitionsTitle: count => `Competitions (${count}):`,
    competitionEventLabel: 'Events',
    eventsNotFound: 'No events found.',
    eventsTitle: count => `Events (${count}):`,
    highlightedNotFound: 'No highlighted events found.',
    highlightedTitle: count => `Highlighted events (${count}):`,
    leagueLabel: 'League',
    dateLabel: 'Date',
    oddsLabel: 'Odds',
    noOdds: 'No odds data.',
    unknownCompetition: 'Unknown Competition',
    unknownMarket: 'Unknown Market',
  },
}

export function resolveLocale(locale?: unknown): Locale {
  return locale === 'en' ? 'en' : 'tr'
}

export function getDictionary(locale?: unknown): Dictionary {
  return dictionaries[resolveLocale(locale)]
}

export function formatUnixDate(seconds: number, locale?: unknown): string {
  return new Date(seconds * 1000).toLocaleString(
    resolveLocale(locale) === 'en' ? 'en-US' : 'tr-TR',
  )
}
