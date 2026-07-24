import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "WEB AI Engineering Club — Portfolio Challenge",
  description: "Choose your hero. Start your mission. Read your scenario.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Toaster position="top-right" toastOptions={{
          style:{ background:"rgba(10,10,20,.95)", backdropFilter:"blur(20px)", border:"1px solid rgba(139,92,246,.3)", color:"#f0f0ff", borderRadius:".75rem" }
        }}/>
      </body>
    </html>
  );
}
