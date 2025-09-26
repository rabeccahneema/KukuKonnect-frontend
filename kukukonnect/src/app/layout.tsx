import type { Metadata } from "next";
import "./globals.css";
import { Nunito } from "next/font/google";
const nunito = Nunito({ subsets: ['latin'], weight: ["400", "700", "900"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "KukuKonnect",
  description: "KukuKonnect dashboard",
    generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next15", "pwa", "next-pwa"],
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F59E42" />
      </head>
      <body className="font-nunito bg-[#F7F9FA]">{children}</body>
      
    </html>



  );
}