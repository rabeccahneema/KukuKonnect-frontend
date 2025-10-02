import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-nunito", 
});



export const metadata: Metadata = {
  title: "KukuKonnect",
  description: "KukuKonnect dashboard",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next15", "pwa", "next-pwa"],
  icons: [],
};

export const viewport: Viewport = {
  themeColor: "#f59e42",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        
      </head>
      <body className={` ${nunito.variable} antialiased`} >
        {children}
      </body>
    </html>
  );
}
