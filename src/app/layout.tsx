import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Roboto({
  subsets: ["latin"],
    weight : ["400"]
});


export const metadata: Metadata = {
  title: "App name",
  description: "Cancer detection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className}  antialiased bg-slate-50`}
      >
        <Navbar />
        <div className="min-h-[100vh] p-2"> {children}</div>

      <Footer />
      </body>
    </html>
  );
}
