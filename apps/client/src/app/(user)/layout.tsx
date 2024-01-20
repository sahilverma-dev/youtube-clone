import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/custom/Sidebar";
import Header from "@/components/custom/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s - Youtube Clone",
    default: "Youtube Clone",
  },
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
            <main className="w-full h-dvh overflow-y-auto">
              <Header />
              <div className="w-full p-4">{children}</div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
