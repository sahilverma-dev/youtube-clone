import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/custom/Sidebar";

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
        <Providers>
          <div className="flex w-full h-dvh">
            <Sidebar />
            <main className="p-4 h-dvh overflow-y-auto">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
