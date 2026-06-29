// Curated channel list with multiple servers (HLS / DASH / iframe)
// Mirrors the ezshomadhan.com channel catalogue

export type StreamType = "hls" | "dash" | "iframe";

export interface StreamServer {
  name: string;
  url: string;
  type: StreamType;
  drmKid?: string;
  drmKey?: string;
}

export type ChannelCategory =
  | "sports"
  | "news"
  | "entertainment"
  | "music"
  | "international";

export interface EzChannel {
  id: string;
  name: string;
  logo: string;
  category: ChannelCategory;
  quality: "HD" | "FHD" | "4K";
  nowPlaying: string;
  servers: StreamServer[];
}

export const EZ_CHANNELS: EzChannel[] = [
  // ─── SPORTS ──────────────────────────────────────────────────────────────────
  {
    id: "1",
    name: "FIFA World Cup 2026",
    logo: "https://assets.football-logos.cc/logos/tournaments/700x700/fifa-world-cup-2026--white.9ba8a004.png",
    category: "sports",
    quality: "FHD",
    nowPlaying: "Live Match",
    servers: [
      { name: "WC 2026", url: "https://tahmidx.cinemoja.workers.dev/", type: "hls" },
      {
        name: "TOFFEE 4",
        url: "https://toffee-proxy.shahriar-diu64.workers.dev/https://prod-cdn01-live.toffeelive.com/live/FIFA-2026-2/0/master_3000.m3u8",
        type: "hls",
      },
      {
        name: "TOFFEE 5",
        url: "https://tahmidx.shusanta-project.workers.dev/",
        type: "hls",
      },
      {
        name: "Bac 1",
        url: "https://bdix.my.id/onair/e.php?channel=fifa",
        type: "iframe",
      },
      {
        name: "WIW",
        url: "https://1nyaler.streamhostingcdn.top/stream/32/index.m3u8",
        type: "hls",
      },
      {
        name: "FIFA (Arabic)",
        url: "https://cp11.adabmedia.com/hls2/sport.m3u8",
        type: "hls",
      },
      { name: "BEIN", url: "https://cp11.adabmedia.com/hls2/sport.m3u8", type: "hls" },
      {
        name: "BEIN 1",
        url: "https://1nyaler.streamhostingcdn.top/stream/23/index.m3u8",
        type: "hls",
      },
      {
        name: "TOFFEE",
        url: "https://toffee-proxy.shahriar-diu64.workers.dev/https://prod-cdn01-live.toffeelive.com/live/FIFA-2026-4/0/master_2000.m3u8",
        type: "hls",
      },
      {
        name: "TOFFEE 2",
        url: "https://toffee-proxy.shahriar-diu64.workers.dev/https://prod-cdn01-live.toffeelive.com/live/FIFA-2026-4/0/master_2000.m3u8",
        type: "hls",
      },
      {
        name: "TVP",
        url: "https://1nyaler.streamhostingcdn.top/stream/89/index.m3u8",
        type: "hls",
      },
      {
        name: "Z Bangla",
        url: "https://d1g8wgjurz8via.cloudfront.net/bpk-tv/ColorsHD/default/Zeebanglahd.m3u8",
        type: "hls",
      },
      {
        name: "GOLIVE",
        url: "https://backup.alarafatofficial.workers.dev/?url=https%3A%2F%2Fd1211whpimeups.cloudfront.net%2Fsmil%3Artbgo%2Fchunklist_b4096000_slENG.m3u8&ua=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F124.0.0.0%20Safari%2F537.36&ekey=SPORTIX_SECURE_KEY_2026",
        type: "hls",
      },
      {
        name: "Somoy TV",
        url: "https://live.thebosstv.com:30443/dwlive/Somoy-TV/chunks.m3u8",
        type: "hls",
      },
      {
        name: "Dsports",
        url: "https://1nyaler.streamhostingcdn.top/stream/106/index.m3u8",
        type: "hls",
      },
    ],
  },
  {
    id: "3",
    name: "T Sports",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzV2mfuaWiI0HdxWZlS5_Q4i7ZOfZnpoy3Gw&s",
    category: "sports",
    quality: "HD",
    nowPlaying: "Sports News",
    servers: [
      {
        name: "Server 2 (Iframe)",
        url: "https://bdix.my.id/onair/e.php?channel=tsports",
        type: "iframe",
      },
      {
        name: "Server 3 (Iframe)",
        url: "https://bdix.my.id/onair/e.php?channel=tsports2",
        type: "iframe",
      },
      {
        name: "TOFFEE 2",
        url: "https://tv.ezshomadhan.com/toffee-player",
        type: "iframe",
      },
      {
        name: "Server 1 (HD HLS)",
        url: "https://tvsen7.aynaott.com/tsports-hd/index.m3u8",
        type: "hls",
      },
    ],
  },
  {
    id: "20",
    name: "FIFA TV",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/FIFA_logo_without_slogan.svg/512px-FIFA_logo_without_slogan.svg.png",
    category: "sports",
    quality: "HD",
    nowPlaying: "Sports",
    servers: [
      {
        name: "Server 1",
        url: "https://f7ccf7fc.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLXB0X0ZJRkFQbHVzUG9ydHVndWVzZV9ITFM/playlist.m3u8",
        type: "hls",
      },
      {
        name: "Server 2",
        url: "https://d2w9q46ikgrcwx.cloudfront.net/v1/manifest/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-of5cbk3sav3w5/be940823-4a17-4fbf-8cd4-ea282e368008/1.m3u8",
        type: "hls",
      },
    ],
  },

  // ─── NEWS ─────────────────────────────────────────────────────────────────────
  {
    id: "5",
    name: "Somoy TV",
    logo: "https://media-stg.assettype.com/bdnews-english/import/english/imgAll/2024August/somoy-tv-logo-1723310567.jpg",
    category: "news",
    quality: "HD",
    nowPlaying: "News Hour",
    servers: [
      {
        name: "Somoy TV",
        url: "https://live.thebosstv.com:30443/dwlive/Somoy-TV/chunks.m3u8",
        type: "hls",
      },
      {
        name: "Server 1 (HLS)",
        url: "https://bozztv.com/rongo/rongo-somoy/index.m3u8",
        type: "hls",
      },
      {
        name: "Server 2 (Iframe)",
        url: "https://bdix.my.id/onair/e.php?channel=somoy",
        type: "iframe",
      },
    ],
  },
  {
    id: "6",
    name: "NTV",
    logo: "https://akashgo-mediaready.videoready.tv/akashgo/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://tstatic.akash-go.com/cms-ui/images/custom-content/1735560848115.png",
    category: "news",
    quality: "HD",
    nowPlaying: "Live News",
    servers: [
      {
        name: "Server 1",
        url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1716/output/index.m3u8",
        type: "hls",
      },
    ],
  },
  {
    id: "12",
    name: "Channel 1",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/%E0%A6%9A%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%A8%E0%A7%87%E0%A6%B2_%E0%A6%93%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%A8%E0%A7%87%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.svg/500px-%E0%A6%9A%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%A8%E0%A7%87%E0%A6%B2_%E0%A6%93%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%A8%E0%A7%87%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.svg.png",
    category: "news",
    quality: "HD",
    nowPlaying: "News",
    servers: [
      {
        name: "Server 1",
        url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1702/output/index.m3u8",
        type: "hls",
      },
    ],
  },
  {
    id: "13",
    name: "Jamuna TV",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Jamuna_TV_logo.svg/512px-Jamuna_TV_logo.svg.png",
    category: "news",
    quality: "HD",
    nowPlaying: "News",
    servers: [
      {
        name: "Server 2",
        url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1701/output/index.m3u8",
        type: "hls",
      },
    ],
  },
  {
    id: "14",
    name: "Sangsad TV",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/Sangsad_Television_Emblem.svg/1280px-Sangsad_Television_Emblem.svg.png",
    category: "news",
    quality: "HD",
    nowPlaying: "News",
    servers: [
      {
        name: "Server 2",
        url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1709/output/index.m3u8",
        type: "hls",
      },
    ],
  },
  {
    id: "15",
    name: "Channel 24",
    logo: "https://akashgo-mediaready.videoready.tv/akashgo/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://tstatic.akash-go.com/cms-ui/images/custom-content/1735556524751.png",
    category: "news",
    quality: "HD",
    nowPlaying: "News",
    servers: [
      {
        name: "Server 2",
        url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1703/output/index.m3u8",
        type: "hls",
      },
    ],
  },
  {
    id: "16",
    name: "News 24",
    logo: "https://images.seeklogo.com/logo-png/36/1/news24-channel-logo-png_seeklogo-362149.png",
    category: "news",
    quality: "HD",
    nowPlaying: "News",
    servers: [
      {
        name: "Server 2",
        url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1708/output/index.m3u8",
        type: "hls",
      },
    ],
  },
  {
    id: "18",
    name: "Star News",
    logo: "https://akashgo-mediaready.videoready.tv/akashgo/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://tstatic.akash-go.com/cms-ui/images/custom-content/1770189845719.png",
    category: "news",
    quality: "HD",
    nowPlaying: "News",
    servers: [
      {
        name: "Server 1",
        url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1710/output/index.m3u8",
        type: "hls",
      },
    ],
  },
  {
    id: "19",
    name: "Ekattor TV",
    logo: "https://i.postimg.cc/D0xCDZqj/20250529-071258.png",
    category: "news",
    quality: "HD",
    nowPlaying: "News",
    servers: [
      {
        name: "Server 1",
        url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1705/output/1705.m3u8",
        type: "hls",
      },
      {
        name: "Server 2",
        url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1705/output/index.m3u8",
        type: "hls",
      },
    ],
  },
  {
    id: "23",
    name: "DBC News",
    logo: "https://i.ibb.co.com/NX6gsgJ/dbc-news.jpg",
    category: "news",
    quality: "HD",
    nowPlaying: "News",
    servers: [
      {
        name: "Server 1",
        url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1728/output/index.m3u8",
        type: "hls",
      },
    ],
  },

  // ─── ENTERTAINMENT ────────────────────────────────────────────────────────────
  {
    id: "17",
    name: "Deepto Tv",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/00/Logo_of_Deepto_TV.svg/330px-Logo_of_Deepto_TV.svg.png",
    category: "entertainment",
    quality: "HD",
    nowPlaying: "Entertainment",
    servers: [
      {
        name: "Server 1",
        url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1711/output/index.m3u8",
        type: "hls",
      },
    ],
  },
  {
    id: "21-drama",
    name: "G-Series",
    logo: "https://i.ibb.co.com/35G4dT0k/G-Series.png",
    category: "entertainment",
    quality: "HD",
    nowPlaying: "Entertainment",
    servers: [
      {
        name: "Server 1",
        url: "https://vods2.aynaott.com/gseriesDrama/tracks-v1a1/mono.ts.m3u8",
        type: "hls",
      },
    ],
  },
  {
    id: "22-ent",
    name: "Discovery HD",
    logo: "https://i.ibb.co.com/1GyTG78k/Discovery-HD.webp",
    category: "entertainment",
    quality: "HD",
    nowPlaying: "Entertainment",
    servers: [
      {
        name: "Server 1",
        url: "https://ottbanglaplatform.com/tv/toffee/live.php?id=discovery_hd&e=.m3u8",
        type: "hls",
      },
    ],
  },

  // ─── INTERNATIONAL ────────────────────────────────────────────────────────────
  {
    id: "32",
    name: "DW (English)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/DW_Logo_2012.svg/1200px-DW_Logo_2012.svg.png",
    category: "international",
    quality: "HD",
    nowPlaying: "International News",
    servers: [
      {
        name: "Server 1",
        url: "https://dwamdstream104.akamaized.net/hls/live/2015530/dwstream104/index.m3u8",
        type: "hls",
      },
    ],
  },
];

export const CATEGORIES: {
  label: string;
  value: ChannelCategory | "all";
  icon: string;
}[] = [
  { label: "All", value: "all", icon: "📺" },
  { label: "Sports", value: "sports", icon: "🏆" },
  { label: "News", value: "news", icon: "📰" },
  { label: "Entertainment", value: "entertainment", icon: "🎬" },
  { label: "Music", value: "music", icon: "🎵" },
  { label: "International", value: "international", icon: "🌍" },
];
