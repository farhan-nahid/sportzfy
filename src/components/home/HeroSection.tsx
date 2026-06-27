"use client";

const NOTICE_TEXT =
  "📢 Important Notice: Sportzfy does not host any live TV streams. We only provide easy access to publicly available streams on the internet. If you face issues watching any channel/match, please try a different server. For the latest World Cup 2026 updates, new links & smooth streaming, bookmark this page. 🏆⚽";

export default function HeroSection() {
  // Duplicate text so the loop is seamless
  const doubled = [NOTICE_TEXT, NOTICE_TEXT];

  return (
    <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 border-b border-white/5">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3">
        <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <div className="marquee-container flex-1 min-w-0">
          <span
            className="marquee-track text-sm text-blue-300"
            style={{ animationDuration: "55s" }}
          >
            {doubled.map((text, i) => (
              <span key={i} className="marquee-item">
                {text}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
