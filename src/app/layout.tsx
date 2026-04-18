import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalContactModal from "@/components/GlobalContactModal";
import HeroNavbar from "@/components/HeroNavbar";
import RootLayoutClient from "./RootLayoutClient";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ShriDev Freelance - Project Management System",
  description: "Professional freelancing project management and showcase platform",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      "https://www.shridevfreelance.online"
  ),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo/ShriDev_Freelance_logo.png", type: "image/png", sizes: "any" },
    ],
    apple: [{ url: "/images/logo/ShriDev_Freelance_logo.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "ShriDev Freelance - Project Management System",
    description: "Professional freelancing project management and showcase platform",
    images: [
      {
        url: "/images/logo/ShriDev_Freelance_logo.png",
        width: 1200,
        height: 630,
        alt: "ShriDev Freelance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShriDev Freelance - Project Management System",
    description: "Professional freelancing project management and showcase platform",
    images: ["/images/logo/ShriDev_Freelance_logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-[#F8FAFC]`}>
        <HeroNavbar />
        <RootLayoutClient>{children}</RootLayoutClient>
        <GlobalContactModal />
      </body>
    </html>
  );
}
