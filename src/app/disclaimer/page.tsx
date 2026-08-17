import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Disclaimer – Sportzfy",
  description:
    "Read the Sportzfy disclaimer about IPTV stream availability, legal usage, and content ownership.",
};

export default function DisclaimerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <PageHero
        icon="⚠️"
        title="Disclaimer"
        description="Please read this disclaimer carefully before using Sportzfy."
      />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="prose-sportzfy space-y-6">
          {[
            {
              title: "Nature of This Service",
              content:
                "Sportzfy is a free IPTV channel directory and schedule listing service. We do not host, upload, or store any video content on our servers. All streams linked or embedded on this website are publicly available on the internet and are not under the control of Sportzfy.",
            },
            {
              title: "No Affiliation with Broadcasters",
              content:
                "Sportzfy is an independent directory and is not affiliated with, endorsed by, or connected to any broadcaster, TV network, sports league, or streaming platform mentioned on this site. Channel logos, names, and trademarks are the property of their respective owners.",
            },
            {
              title: "Stream Availability",
              content:
                "Stream availability can change at any time without notice. Sportzfy does not guarantee that any listed stream will be available or functional at any given time. If a stream does not work, please try an alternative server or check back later.",
            },
            {
              title: "Personal Use Only",
              content:
                "This service is provided for personal, non-commercial use only. Users are responsible for ensuring that their use of any stream is lawful in their jurisdiction. Sportzfy is not responsible for how users access or use the content linked from this site.",
            },
            {
              title: "Copyright",
              content:
                "Sportzfy respects intellectual property rights. If you believe that any content linked from this site infringes upon your copyright, please contact us with the relevant information and we will act promptly to remove the link.",
            },
            {
              title: "Accuracy of Information",
              content:
                "While we strive to keep schedule and channel information accurate and up-to-date, Sportzfy makes no warranties regarding the accuracy, completeness, or timeliness of any information on this site. Match times, channel names, and stream links are provided on a best-effort basis.",
            },
            {
              title: "Third-Party Links",
              content:
                "Sportzfy may contain links to third-party websites and stream players. We have no control over the content, privacy policies, or practices of these third-party sites and accept no responsibility for them.",
            },
            {
              title: "Limitation of Liability",
              content:
                "To the fullest extent permitted by law, Sportzfy and its operators shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use of this website or any content found through it.",
            },
          ].map(({ title, content }) => (
            <section
              key={title}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5"
            >
              <h2 className="mb-2 font-bold text-base text-foreground">{title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{content}</p>
            </section>
          ))}

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center">
            <p className="text-muted-foreground text-sm">
              By using Sportzfy, you acknowledge that you have read and understood this
              disclaimer and agree to use the service for personal, lawful purposes only.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground text-sm transition-all hover:opacity-90"
            >
              📺 Back to Channels
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
