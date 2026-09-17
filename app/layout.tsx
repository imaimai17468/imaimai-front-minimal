import "@/styles.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "メモ",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Providers>
          <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10">
            <h1 className="text-2xl font-semibold tracking-tight">メモ</h1>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
