import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../(user)/globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Youtube Clone",
  description: "Youtube Clone by Sahil Verma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "bg-background")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
