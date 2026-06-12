import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lazarus MCP | Bring dead repositories back to life",
  description:
    "A CLI-first and MCP tool that scans broken repositories, autopsies failures, applies safe playbooks, verifies builds/tests, and generates judge-ready evidence.",
  openGraph: {
    title: "Lazarus MCP",
    description: "Bring dead repositories back to life.",
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
