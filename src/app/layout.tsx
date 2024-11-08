import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Footer, NavBar } from "@/components";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "BlackDiamond",
  description: "Welcome to BlackDiamond",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` bg-black`}>
        <NextTopLoader showSpinner={false} />
        <ReactQueryProvider>
          {/* <UserProvider> */}
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            toastOptions={{
              style: {
                border: "1px solid #E4E7EC",
                borderRadius: 15,
                padding: "16px",
                color: "#fff",
                backgroundColor: "#333333",
                fontSize: 15,
                fontWeight: 400,
              },
            }}
          />
          <NavBar className="fixed top-0 z-50" />
          <main className="bg-black flex-grow">{children}</main>
          <Footer />
          {/* </UserProvider> */}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
