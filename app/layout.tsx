import type { Metadata, Viewport } from "next";
import { Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

// Police arabe embarquée : rendu identique sur Windows, macOS, Linux et mobile
const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "Clavier Arabe — لوحة مفاتيح عربية",
  description:
    "Un vrai clavier arabe (disposition Arabic 101) directement dans le navigateur : tapez avec votre clavier physique AZERTY ou QWERTY, ou cliquez sur les touches.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e1117",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={naskh.variable}>
      <body>{children}</body>
    </html>
  );
}
