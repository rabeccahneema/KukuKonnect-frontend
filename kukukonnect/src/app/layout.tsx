import "./globals.css";
import { Nunito } from "next/font/google";
const nunito = Nunito({ subsets: ['latin'], weight: ["400", "700", "900"], variable: "--font-nunito" });
export const metadata = {
  title: "KukuKonnect Account",
  description: "Account pages for KukuKonnect App",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="font-nunito bg-[#F7F9FA]">{children}</body>
    </html>
  );
}
