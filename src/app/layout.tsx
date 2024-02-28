import "./globals.css";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {Providers} from "./providers";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_PROJECT_NAME,
  description: "A collection of 177 unique AI-generated and human-curated pieces designed to ignite the EARNer in you!",
  applicationName: process.env.NEXT_PUBLIC_PROJECT_NAME,
  twitter: {
    card: "summary_large_image",
    site: "flamestarters.buyholdearn.com",
    creator: "@buyholdearn",
    images: "https://flamestarters.buyholdearn.com/featured_image.jpg",
  },
  openGraph: {
    type: "website",
    url: "https://flamestarters.buyholdearn.com",
    title: "The FlameStarters",
    description:
      "A collection of 177 unique AI-generated and human-curated pieces designed to ignite the EARNer in you!",
    siteName: "The FlameStarters",
    images: [
      {
        url: "https://flamestarters.buyholdearn.com/featured_image.jpg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
