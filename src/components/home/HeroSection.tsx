"use client";

const NOTICE_TEXT =
  "📢 Important Notice: Sportzfy does not host any live TV streams. We only provide easy access to publicly available streams on the internet. If you face issues watching any channel/match, please try a different server. For the latest World Cup 2026 updates, new links & smooth streaming, bookmark this page. 🏆⚽";

export default function HeroSection() {
  // Duplicate text so the loop is seamless
  const doubled = [
    { id: "notice-1", text: NOTICE_TEXT },
    { id: "notice-2", text: NOTICE_TEXT },
  ];

  return (
    <div className="border-white/5 border-b bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10">
      <div className="mx-auto flex max-w-screen-xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <span className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-blue-400" />
        <div className="marquee-container min-w-0 flex-1">
          <span
            className="marquee-track text-blue-300 text-sm"
            style={{ animationDuration: "55s" }}
          >
            {doubled.map((item) => (
              <span key={item.id} className="marquee-item">
                {item.text}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
