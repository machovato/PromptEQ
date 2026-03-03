import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalHeader } from "../components/GlobalHeader";
import { GlobalFooter } from "../components/GlobalFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PromptEQ - AI System Prompt Generator",
  description: "A brutalist system prompt generator for AI models.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-[#FAFAFA] text-[#15151A]`}
      >
        <GlobalHeader />
        <main className="flex-1 flex flex-col min-h-0">
          {children}
        </main>
        <GlobalFooter />
      </body>
    </html>
  );
}
