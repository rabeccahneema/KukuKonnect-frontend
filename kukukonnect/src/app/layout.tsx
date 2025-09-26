import type { Metadata } from "next";
import "./globals.css";
import { Nunito } from "next/font/google";
const nunito = Nunito({ subsets: ['latin'], weight: ["400", "700", "900"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "KukuKonnect",
  description: "KukuKonnect dashboard",
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