import "./styles/globals.css";
import { DM_Serif_Display, Fraunces, Inter_Tight, Manrope } from "next/font/google";
import { AppProviders } from "@/app/providers/app-providers";

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700"]
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"]
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: ["400"]
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata = {
  title: "Brooklyn LMS Landing",
  description: "Multi-tenant landing pages"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${dmSerif.variable} ${interTight.variable}`}>
      <body className="font-body">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
