import type { Metadata } from "next";
import { Geist, Geist_Mono, Open_Sans } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SideMenu } from "@/components/navigation";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PixlFix",
  description: "image resizer and converter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.className} antialiased`}
      >
        <SidebarProvider
        defaultOpen={false}>
          <SideMenu/>
          
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
