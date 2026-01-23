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
  title: "SWL Training Hub",
  description: "Interactive learning platform with modular training content",
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
