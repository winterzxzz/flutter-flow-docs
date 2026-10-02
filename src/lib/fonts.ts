import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";

// Vietnamese subset matters here: half the site is written in Vietnamese and
// a font without it renders diacritics from a fallback face.
export const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});
