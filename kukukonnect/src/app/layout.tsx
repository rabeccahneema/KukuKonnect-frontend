import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
const nunito = Nunito({
  weight: ["400", "600", "700"],
});
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KukuKonnect",
  description: "KukuKonnect dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunito.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
