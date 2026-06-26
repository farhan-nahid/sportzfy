import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sportzfy – Live Sports Streaming",
  description:
    "Watch live sports channels from around the world. Filter by country and sport category — Cricket, Football, Basketball, Tennis, and more.",
  keywords: [
    "live sports streaming",
    "cricket live",
    "football live",
    "sports channels",
    "basketball live",
    "tennis live",
  ],
  openGraph: {
    title: "Sportzfy – Live Sports Streaming",
    description: "Live sports channels from every corner of the globe.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        {children}
      </body>
    </html>
  );
}
