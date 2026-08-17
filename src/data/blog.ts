// Blog post data
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  emoji: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "what-is-iptv",
    title: "What Is IPTV? A Complete Guide to Internet Protocol Television",
    excerpt:
      "IPTV (Internet Protocol Television) delivers TV content over the internet instead of traditional satellite or cable. Learn how it works, what types exist, and how to get started watching free live TV online.",
    date: "2026-08-10",
    category: "Guide",
    readTime: "5 min read",
    emoji: "📺",
  },
  {
    id: "3",
    slug: "best-sports-iptv-channels",
    title: "The Best Free Sports IPTV Channels in 2026",
    excerpt:
      "From beIN Sports to Fox Sports, TSN, Sky Sports, and ESPN — here are the top free live sports IPTV channels you can stream right now, organised by sport and country.",
    date: "2026-08-05",
    category: "Channels",
    readTime: "6 min read",
    emoji: "🏆",
  },
  {
    id: "4",
    slug: "how-to-watch-iptv-on-any-device",
    title: "How to Watch Live IPTV on Any Device: Phone, TV, PC",
    excerpt:
      "Whether you're on Android, iOS, Smart TV, Firestick, or a desktop browser, this guide shows you exactly how to watch free live IPTV streams on any device — no special app required.",
    date: "2026-08-01",
    category: "Guide",
    readTime: "7 min read",
    emoji: "📱",
  },
  {
    id: "5",
    slug: "iptv-vs-streaming-services",
    title: "Free IPTV vs Paid Streaming: What's the Difference?",
    excerpt:
      "Netflix, Disney+, and Prime Video are paid streaming services, but IPTV is a different technology. Understand the key differences, advantages of free IPTV, and when each is the right choice for you.",
    date: "2026-07-28",
    category: "Education",
    readTime: "5 min read",
    emoji: "🔍",
  },
  {
    id: "6",
    slug: "premier-league-free-streams",
    title: "Where to Watch Premier League Matches for Free in 2026",
    excerpt:
      "The Premier League season is underway and here's a complete breakdown of which TV channels broadcast Premier League games for free globally, with direct stream links.",
    date: "2026-07-22",
    category: "Football",
    readTime: "4 min read",
    emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  },
];
