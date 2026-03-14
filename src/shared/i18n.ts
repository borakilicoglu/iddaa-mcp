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

const enTextReplacements: Array<[RegExp, string]> = [
  [/Türkiye Süper Lig/g, 'Turkish Super League'],
  [/Almanya Bundesliga/g, 'German Bundesliga'],
  [/İspanya La Liga/g, 'Spanish La Liga'],
  [/İtalya Serie A/g, 'Italian Serie A'],
  [/Fransa Ligue 1/g, 'French Ligue 1'],
  [/Portekiz Premier League/g, 'Portuguese Premier League'],
  [/İsviçre Süper Lig/g, 'Swiss Super League'],
  [/Hollanda Eredivisie/g, 'Dutch Eredivisie'],
  [/İngiltere Premier Lig/g, 'English Premier League'],
  [/Hangi Yarıda Daha Fazla Gol Olur/g, 'Which Half Has More Goals'],
  [/İlk Yarı Sonucu ve İlk Yarı Karşılıklı Gol/g, 'First Half Result and First Half BTTS'],
  [/İlk Yarı \/ Maç Sonucu/g, 'First Half / Match Result'],
  [/Maç Sonucu ve Karşılıklı Gol/g, 'Match Result and BTTS'],
  [/Maç Sonucu ve Alt\/Üst 2\.5/g, 'Match Result and Under/Over 2.5'],
  [/Altı\/Üstü 2\.5 ve Karşılıklı Gol/g, 'Under/Over 2.5 and BTTS'],
  [/İlk Yarı Toplam Korner Sayısı Alt\/Üst/g, 'First Half Total Corners Under/Over'],
  [/Toplam Korner Sayısı Alt\/Üst/g, 'Total Corners Under/Over'],
  [/İlk Yarı Altı\/Üstü/g, 'First Half Under/Over'],
  [/İlk Yarı Alt\/Üst/g, 'First Half Under/Over'],
  [/Karşılıklı Gol/g, 'Both Teams To Score'],
  [/Çifte Şans/g, 'Double Chance'],
  [/Tek \/ Çift/g, 'Odd / Even'],
  [/Toplam Gol/g, 'Total Goals'],
  [/Maç Sonucu/g, 'Match Result'],
  [/İlk Yarı Sonucu/g, 'First Half Result'],
  [/İkinci Yarı Sonucu/g, 'Second Half Result'],
  [/Ev Sahibi/g, 'Home Team'],
  [/Deplasman/g, 'Away Team'],
  [/Her İki Yarıyı Kazanır/g, 'Win Both Halves'],
  [/Handikaplı Maç Sonucu/g, 'Handicap Match Result'],
  [/Alt/g, 'Under'],
  [/Üst/g, 'Over'],
  [/Var/g, 'Yes'],
  [/Yok/g, 'No'],
  [/Evet/g, 'Yes'],
  [/Hayır/g, 'No'],
]

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

export function translateBettingText(text: string, locale?: unknown): string {
  if (resolveLocale(locale) !== 'en') {
    return text
  }

  let translated = text
  for (const [pattern, replacement] of enTextReplacements) {
    translated = translated.replace(pattern, replacement)
  }
  return translated
}
