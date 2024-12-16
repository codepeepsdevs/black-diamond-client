import type { Metadata } from "next";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` bg-[#000000]`}>
        <main className="bg-black">{children}</main>
      </body>
    </html>
  );
}
