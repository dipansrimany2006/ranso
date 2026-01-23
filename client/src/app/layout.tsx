import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import CoreLayout from "@/components/layout/CoreLayout";
import { Web3Provider } from "@/providers/Web3Provider";

const poppins = Poppins({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Axicov",
  description: "AI-powered platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <Web3Provider>
          <CoreLayout>{children}</CoreLayout>
        </Web3Provider>
      </body>
    </html>
  );
}
