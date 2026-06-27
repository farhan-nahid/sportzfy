// Channel data types and helpers for Sportzfy
// Live channel data is now loaded dynamically from /api/channels (iptv-org)

export type Sport =
  | "All"
  | "Cricket"
  | "Football"
  | "Basketball"
  | "Tennis"
  | "Hockey"
  | "Swimming"
  | "Motorsport"
  | "Rugby"
  | "Boxing";

export type Country = {
  code: string;
  name: string;
  flag: string;
};

export type Channel = {
  id: string;
  name: string;
  logo: string; // URL or emoji fallback
  sport: Sport;
  country: string; // country code
  isLive: boolean;
  viewers?: string;
  currentMatch?: string;
  streamUrl?: string;
  quality: "HD" | "FHD" | "4K";
  language: string;
};

export const COUNTRIES: Country[] = [
  { code: "ALL", name: "All Countries", flag: "🌍" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "AE", name: "UAE", flag: "🇦🇪" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
];

export const SPORTS: { label: string; value: Sport; emoji: string }[] = [
  { label: "All", value: "All", emoji: "🏆" },
  { label: "Cricket", value: "Cricket", emoji: "🏏" },
  { label: "Football", value: "Football", emoji: "⚽" },
  { label: "Basketball", value: "Basketball", emoji: "🏀" },
  { label: "Tennis", value: "Tennis", emoji: "🎾" },
  { label: "Hockey", value: "Hockey", emoji: "🏑" },
  { label: "Swimming", value: "Swimming", emoji: "🏊" },
  { label: "Motorsport", value: "Motorsport", emoji: "🏎️" },
  { label: "Rugby", value: "Rugby", emoji: "🏉" },
  { label: "Boxing", value: "Boxing", emoji: "🥊" },
];

export function filterChannels(
  channels: Channel[],
  country: string,
  sport: Sport,
): Channel[] {
  return channels.filter((ch) => {
    const matchCountry = country === "ALL" || ch.country === country;
    const matchSport = sport === "All" || ch.sport === sport;
    return matchCountry && matchSport;
  });
}
