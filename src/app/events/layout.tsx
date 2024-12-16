import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blackdiamond Entertainment",
  description:
    "BlackDiamond Entertainment - Your ultimate party and event planning platform. From unforgettable parties to bespoke event experiences, we bring your celebrations to life with style and excitement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-black my-[4rem] sm:my-[6rem] px-4 lg:px-6 py-4">
      {children}
    </div>
  );
}
