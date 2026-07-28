import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WorkoutOS",
  description: "A full-stack gym progress tracker for exercises and routines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <div className="app-shell">
          <div className="page-shell">{children}</div>
        </div>
        <nav className="bottom-nav" aria-label="Primary navigation">
          <Link className="nav-link" href="/">
            Home
          </Link>
          <Link className="nav-link" href="/workouts">
            Workouts
          </Link>
          <Link className="nav-link" href="/routines">
            Routines
          </Link>
          <Link className="nav-link" href="/about">
            Profile
          </Link>
        </nav>
      </body>
    </html>
  );
}
 