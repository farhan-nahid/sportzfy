import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const path = slug ? slug.join("/") : "";
  const targetUrl = `https://embed.st/embed/${path}`;

  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: "https://streamed.pk/",
        Origin: "https://streamed.pk",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      return new NextResponse(`Embed error: ${res.status}`, { status: res.status });
    }

    let html = await res.text();

    // Prevent iframe breakouts / top redirects
    html = html.replace(/top\.location\s*=|window\.top\.location\s*=/g, "// blocked=");
    html = html.replace(/if\s*\(\s*window\s*!==?\s*window\.top/g, "if (false");
    html = html.replace(/if\s*\(\s*self\s*!==?\s*top/g, "if (false");

    // Block hidden ad iframe /ad.html
    html = html.replace(/src="\/ad\.html"/g, 'src="about:blank"');

    // Inject ad hiding CSS & popup blocking JS without breaking player scripts
    const antiAdHeader = `
<style>
  /* Hide floating ad overlays while preserving the player container */
  iframe[src*="ad.html"],
  iframe[src*="doubleclick"],
  div[style*="z-index: 2147483647"],
  div[style*="z-index: 99999"],
  .ad-overlay, .prebid-wrapper, .dfp-ad-container {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
    opacity: 0 !important;
  }
</style>
<script>
  try {
    Object.defineProperty(document, 'referrer', { get: () => 'https://streamed.pk/', configurable: true });
  } catch(e) {}
  // Prevent popups and new tabs on click
  window.open = function() { return null; };
  window.alert = function() {};
</script>`;

    if (html.includes("<head>")) {
      html = html.replace("<head>", `<head>${antiAdHeader}`);
    } else {
      html = antiAdHeader + html;
    }

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[/embed proxy] error:", err);
    return new NextResponse("Failed to load stream embed", { status: 502 });
  }
}
