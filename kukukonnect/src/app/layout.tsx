<<<<<<< HEAD
import "./globals.css";
import { Nunito } from "next/font/google";
const nunito = Nunito({ subsets: ['latin'], weight: ["400", "700", "900"], variable: "--font-nunito" });
export const metadata = {
  title: "KukuKonnect Account",
  description: "Account pages for KukuKonnect App",
=======
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
>>>>>>> 517b5caa192d9b736d91a455f0af25bcd253d827
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
<<<<<<< HEAD
    <html lang="en" className={nunito.variable}>
      <body className="font-nunito bg-[#F7F9FA]">{children}</body>
=======
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunito.className} antialiased`}
      >
        {children}
      </body>
>>>>>>> 517b5caa192d9b736d91a455f0af25bcd253d827
    </html>
  );
}
