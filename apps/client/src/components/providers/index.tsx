"use client";

import { PropsWithChildren } from "react";
import { ThemeProvider } from "./ThemeProvider";
import ReactQueryProvider from "./ReactQueryProvider";
import { CookiesProvider } from "react-cookie";
import { Toaster } from "../ui/toaster";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        storageKey="youtube-theme"
        disableTransitionOnChange
      >
        <CookiesProvider>
          <Toaster />
          {children}
        </CookiesProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
};

export default Providers;
