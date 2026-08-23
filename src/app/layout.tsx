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
      <body className={`bg-black`}>
        <NextTopLoader showSpinner={false} />
        <ReactQueryProvider>
          {/* <UserProvider> */}
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            toastOptions={{
              duration: 5000,
              style: {
                background: "#000000",
                color: "#ffffff",
                border: "1px solid #ffffff",
                borderLeft: "6px solid #ffffff",
                borderRadius: "0px",
                padding: "16px 20px",
                fontSize: "14px",
                fontWeight: 400,
              },
              success: {
                duration: 5000,
                style: {
                  background: "#000000",
                  color: "#22c55e",
                  border: "1px solid #22c55e",
                  borderLeft: "6px solid #22c55e",
                  borderRadius: "0px",
                },
                iconTheme: { primary: "#22c55e", secondary: "#000000" },
              },
              error: {
                duration: 6000,
                style: {
                  background: "#000000",
                  color: "#ff2d55",
                  border: "1px solid #ff2d55",
                  borderLeft: "6px solid #ff2d55",
                  borderRadius: "0px",
                },
                iconTheme: { primary: "#ff2d55", secondary: "#000000" },
              },
              loading: {
                style: {
                  background: "#000000",
                  color: "#ffffff",
                  border: "1px solid #ffffff",
                  borderLeft: "6px solid #ffffff",
                  borderRadius: "0px",
                },
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
