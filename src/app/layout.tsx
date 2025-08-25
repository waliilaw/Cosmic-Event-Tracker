import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LenisProvider } from "@/components/LenisProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cosmic Event Tracker",
  description: "Track Near-Earth Objects and cosmic events using NASA's Open APIs - Developed by Wali",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="lenis">
      <body
        className={`${spaceGrotesk.variable} font-sans antialiased`}
      >
        <LenisProvider>
          <AuthProvider>
            <div className="content-wrapper">
              {children}
            </div>
          </AuthProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
