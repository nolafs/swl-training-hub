import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import {PrismicPreview} from "@prismicio/next";
import {repositoryName} from "@/prismicio";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "SWL Training Hub",
    template: "%s | SWL Training Hub",
  },
  description: "Interactive learning platform with modular training content",
  applicationName: "SWL Training Hub",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SWL Training",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} font-sans antialiased`}
      >
        {children}

        {/* Prismic preview */}
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
