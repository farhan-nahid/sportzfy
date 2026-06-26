/**
 * IPTV M3U playlist parser for Sportzfy.
 * Parses raw M3U text from iptv-org into our Channel shape.
 */

import type { Channel, Sport } from "@/data/channels";

// ─── M3U parsing types ───────────────────────────────────────────────────────

interface M3UEntry {
  url: string;
  name: string;
  logo: string;
  groupTitle: string;
  tvgCountry: string;
  tvgLanguage: string;
  tvgId: string;
}

// ─── Sport mapping ────────────────────────────────────────────────────────────

/** Maps keywords found in M3U group-title / channel name → our Sport type */
const SPORT_KEYWORD_MAP: [RegExp, Sport][] = [
  [/cricket/i, "Cricket"],
  [/football|soccer|premier|laliga|bundesliga|serie.?a|ligue|mls|champions|la liga/i, "Football"],
  [/basketball|nba|wnba/i, "Basketball"],
  [/tennis|wimbledon|atp|wta/i, "Tennis"],
  [/hockey|nhl|field.?hockey/i, "Hockey"],
  [/swimming|aquatic/i, "Swimming"],
  [/formula|f1|motorsport|motogp|nascar|racing|grand prix/i, "Motorsport"],
  [/rugby|nrl|urc|six.?nations/i, "Rugby"],
  [/boxing|mma|ufc|fight/i, "Boxing"],
];

function detectSport(groupTitle: string, name: string): Sport {
  const haystack = `${groupTitle} ${name}`;
  for (const [pattern, sport] of SPORT_KEYWORD_MAP) {
    if (pattern.test(haystack)) return sport;
  }
  return "Football"; // default for generic sports channels
}

// ─── Country mapping ──────────────────────────────────────────────────────────

const SUPPORTED_COUNTRIES = new Set([
  "BD", "IN", "GB", "US", "AU", "PK", "SA", "AE", "ZA", "NZ",
]);

function normaliseCountry(tvgCountry: string): string {
  if (!tvgCountry) return "US";
  // tvg-country can be comma-separated (e.g. "US,CA") — take the first
  const code = tvgCountry.split(",")[0].trim().toUpperCase();
  return SUPPORTED_COUNTRIES.has(code) ? code : "US";
}

// ─── Quality detection ────────────────────────────────────────────────────────

function detectQuality(name: string): "HD" | "FHD" | "4K" {
  if (/4k|uhd|2160/i.test(name)) return "4K";
  if (/fhd|1080/i.test(name)) return "FHD";
  return "HD";
}

// ─── Language normalisation ───────────────────────────────────────────────────

function normaliseLang(raw: string): string {
  if (!raw) return "English";
  return raw.split(";")[0].trim() || "English";
}

// ─── Logo helper ──────────────────────────────────────────────────────────────

/** Sport → emoji fallback when no logo URL is available */
const SPORT_EMOJI: Record<Sport, string> = {
  All: "📺",
  Cricket: "🏏",
  Football: "⚽",
  Basketball: "🏀",
  Tennis: "🎾",
  Hockey: "🏑",
  Swimming: "🏊",
  Motorsport: "🏎️",
  Rugby: "🏉",
  Boxing: "🥊",
};

// ─── Parser ───────────────────────────────────────────────────────────────────

/**
 * Parse raw M3U text (from iptv-org) into an array of M3UEntry objects.
 * We only keep entries that have a valid HTTP stream URL.
 */
function parseM3URaw(raw: string): M3UEntry[] {
  const lines = raw.split(/\r?\n/);
  const entries: M3UEntry[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith("#EXTINF:")) continue;

    // Parse attributes from the #EXTINF line
    const tvgId = line.match(/tvg-id="([^"]*)"/)?.[1] ?? "";
    const tvgName = line.match(/tvg-name="([^"]*)"/)?.[1] ?? "";
    const tvgLogo = line.match(/tvg-logo="([^"]*)"/)?.[1] ?? "";
    const tvgCountry = line.match(/tvg-country="([^"]*)"/)?.[1] ?? "";
    const tvgLanguage = line.match(/tvg-language="([^"]*)"/)?.[1] ?? "";
    const groupTitle = line.match(/group-title="([^"]*)"/)?.[1] ?? "";

    // Channel name is after the last comma on the #EXTINF line
    const nameMatch = line.match(/,(.+)$/);
    const name = (nameMatch?.[1] ?? tvgName).trim();

    // The stream URL is on the very next non-empty line
    let url = "";
    for (let j = i + 1; j < lines.length; j++) {
      const next = lines[j].trim();
      if (next && !next.startsWith("#")) {
        url = next;
        break;
      }
    }

    if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) {
      continue;
    }

    entries.push({ url, name, logo: tvgLogo, groupTitle, tvgCountry, tvgLanguage, tvgId });
  }

  return entries;
}

// ─── Public API ───────────────────────────────────────────────────────────────

let _idCounter = 0;
function nextId() {
  return `iptv-${++_idCounter}`;
}

/**
 * Parse a raw M3U string and return an array of Channel objects
 * compatible with the Sportzfy data model.
 *
 * @param raw  - Raw M3U playlist text
 * @param limit - Max number of channels to return (default 200)
 */
export function parseM3UToChannels(raw: string, limit = 200): Channel[] {
  _idCounter = 0;
  const entries = parseM3URaw(raw);

  const channels: Channel[] = entries.slice(0, limit).map((e) => {
    const sport = detectSport(e.groupTitle, e.name);
    const country = normaliseCountry(e.tvgCountry);
    const quality = detectQuality(e.name);
    const language = normaliseLang(e.tvgLanguage);

    return {
      id: nextId(),
      name: e.name || "Unknown Channel",
      logo: e.logo || SPORT_EMOJI[sport],
      sport,
      country,
      isLive: true, // IPTV channels are assumed live
      viewers: undefined,
      currentMatch: undefined,
      streamUrl: e.url,
      quality,
      language,
    };
  });

  return channels;
}

/**
 * The primary IPTV playlist URL (iptv-org sports category).
 * Fetched server-side to avoid CORS issues.
 */
export const IPTV_SPORTS_PLAYLIST_URL =
  "https://iptv-org.github.io/iptv/categories/sports.m3u";
