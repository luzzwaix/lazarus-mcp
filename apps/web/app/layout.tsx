import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lazarus MCP — Dead repo resurrection engine",
  description:
    "Dead repo in. Working repo out. Evidence included. A CLI-first and MCP tool that scans broken repositories, autopsies failures, applies safe playbooks, verifies builds/tests, and generates judge-ready evidence.",
  openGraph: {
    title: "Lazarus MCP — Dead repo resurrection engine",
    description: "Dead repo in. Working repo out. Evidence included.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
