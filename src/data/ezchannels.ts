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
      {
        name: "T Sports HD",
        url: "https://tvsen7.aynaott.com/tsports-hd/index.m3u8",
        type: "hls",
      },
      { name: "BEIN 1", url: "https://cp11.adabmedia.com/hls2/sport.m3u8", type: "hls" },
      {
        name: "TOFFEE 2",
        url: "https://tv.ezshomadhan.com/toffee-player",
        type: "iframe",
      },
      {
        name: "BEIN 2 (Adab)",
        url: "https://live.adabmedia.com/hls/bein1.m3u8",
        type: "hls",
      },
      {
        name: "ESPN",
        url: "https://1nyaler.streamhostingcdn.top/stream/97/index.m3u8",
        type: "hls",
      },
      {
        name: "CBS",
        url: "https://tx3.nexgen.bz:4000/CBS_SPORTS/index.m3u8",
        type: "hls",
      },
      {
        name: "TSports (Live)",
        url: "https://103.59.176.72:8083/live1/tracks-v1a1/mono.m3u8?token=123",
        type: "hls",
      },
      {
        name: "Adab Live",
        url: "https://live.adabmedia.com/hls/sport.m3u8",
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
        name: "Server 1 (HD HLS)",
        url: "https://tvsen7.aynaott.com/tsports-hd/index.m3u8",
        type: "hls",
      },
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
        name: "Server 4 (HLS)",
        url: "https://103.59.176.72:8083/live1/tracks-v1a1/mono.m3u8?token=123",
        type: "hls",
      },
    ],
  },
  {
    id: "20",
    name: "FIFA TV",
    logo: "https://cdn.plus.fifa.com/images/web/logoFIFA.png",
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
        name: "Server 1 (HLS)",
        url: "https://bozztv.com/rongo/rongo-somoy/index.m3u8",
        type: "hls",
      },
      {
        name: "Somoy TV",
        url: "https://live.thebosstv.com:30443/dwlive/Somoy-TV/chunks.m3u8",
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
    logo: "https://itcnbd.live/images/36f380e0-6c71-4b27-a73b-2afb3ce7e982.webp",
    category: "news",
    quality: "HD",
    nowPlaying: "News",
    servers: [
      {
        name: "Server 1 (HLS)",
        url: "https://bozztv.com/rongo/rongo-JamunaTelevision/index.m3u8",
        type: "hls",
      },
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
        name: "Server 1 (HLS)",
        url: "https://bozztv.com/rongo/rongo-SangsadTV/index.m3u8",
        type: "hls",
      },
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
        name: "Server 1 (HLS)",
        url: "https://bozztv.com/rongo/rongo-Channel24HD/index.m3u8",
        type: "hls",
      },
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
        name: "Server 1 (HLS)",
        url: "https://bozztv.com/rongo/rongo-News24HD/index.m3u8",
        type: "hls",
      },
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

  // ─── ENTERTAINMENT ────────────────────────────────────────────────────────────
  {
    id: "7",
    name: "Star Jalsha",
    logo: "https://akashgo-mediaready.videoready.tv/akashgo/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://tstatic.akash-go.com/cms-ui/images/custom-content/1735562033891.png",
    category: "entertainment",
    quality: "HD",
    nowPlaying: "Drama",
    servers: [
      {
        name: "Server 1 (HD HLS)",
        url: "https://tvsen4.aynaott.com/n64PH4YL/index.m3u8",
        type: "hls",
      },
      {
        name: "Server 2",
        url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1800/output/index.m3u8",
        type: "hls",
      },
    ],
  },
  {
    id: "8",
    name: "Star Plus",
    logo: "https://akashgo-mediaready.videoready.tv/akashgo/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://tstatic.akash-go.com/cms-ui/images/custom-content/1735561987165.png",
    category: "entertainment",
    quality: "HD",
    nowPlaying: "Drama",
    servers: [
      {
        name: "Server 1",
        url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1801/output/index.m3u8",
        type: "hls",
      },
    ],
  },
  {
    id: "9",
    name: "Sony LIV",
    logo: "https://akashgo-mediaready.videoready.tv/akashgo/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://tstatic.akash-go.com/cms-ui/images/custom-content/1735562086234.png",
    category: "entertainment",
    quality: "HD",
    nowPlaying: "Show",
    servers: [
      {
        name: "Server 1",
        url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1802/output/index.m3u8",
        type: "hls",
      },
    ],
  },
  {
    id: "10",
    name: "Colors",
    logo: "https://akashgo-mediaready.videoready.tv/akashgo/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://tstatic.akash-go.com/cms-ui/images/custom-content/1735562140282.png",
    category: "entertainment",
    quality: "HD",
    nowPlaying: "Reality Show",
    servers: [
      {
        name: "Server 1",
        url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1803/output/index.m3u8",
        type: "hls",
      },
    ],
  },

  // ─── MUSIC ────────────────────────────────────────────────────────────────────
  {
    id: "21",
    name: "MTV Beats",
    logo: "https://akashgo-mediaready.videoready.tv/akashgo/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://tstatic.akash-go.com/cms-ui/images/custom-content/1735562375469.png",
    category: "music",
    quality: "HD",
    nowPlaying: "Music",
    servers: [
      {
        name: "Server 1",
        url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1900/output/index.m3u8",
        type: "hls",
      },
    ],
  },
  {
    id: "22",
    name: "Channel V",
    logo: "https://akashgo-mediaready.videoready.tv/akashgo/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://tstatic.akash-go.com/cms-ui/images/custom-content/1735562419612.png",
    category: "music",
    quality: "HD",
    nowPlaying: "Music",
    servers: [
      {
        name: "Server 1",
        url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1901/output/index.m3u8",
        type: "hls",
      },
    ],
  },

  // ─── INTERNATIONAL ────────────────────────────────────────────────────────────
  {
    id: "30",
    name: "Al Jazeera English",
    logo: "https://akashgo-mediaready.videoready.tv/akashgo/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://tstatic.akash-go.com/cms-ui/images/custom-content/1735562546890.png",
    category: "international",
    quality: "HD",
    nowPlaying: "World News",
    servers: [
      {
        name: "Server 1",
        url: "https://live-hls-web-aje.getaj.net/AJE/index.m3u8",
        type: "hls",
      },
    ],
  },
  {
    id: "31",
    name: "BBC World News",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/BBC_World_News_2022_%28Boxed%29.svg/1200px-BBC_World_News_2022_%28Boxed%29.svg.png",
    category: "international",
    quality: "HD",
    nowPlaying: "World News",
    servers: [
      {
        name: "Server 1",
        url: "https://a.files.bbci.co.uk/media/live/manifesto/audio_video/simulcast/hls/uk/hd/ak/bbc_world_news_english.m3u8",
        type: "hls",
      },
    ],
  },
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
