"use client";

import { Inter } from "next/font/google";
import "./globals.scss";
import Providers from "@/components/providers";
import { Provider } from "react-redux";
import { makeStore } from "@/redux/store";
import { getPreloadedAuthState } from "@/redux/getPreloadedAuthState";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const preloadedState = getPreloadedAuthState();
  const store = makeStore(preloadedState);

  return (
    <Provider store={store}>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning className={inter.className}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </Provider>
  );
}
