import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MUIThemeProvider from "@/theme/MUIThemeProvider";
import ReduxProvider from "@/store/ReduxProvider";
import Navbar from "@/components/layout/Navbar";
import Alert from "@/components/layout/Alert";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Facecooding - Connect with Developers",
  description: "A social network for developers built with Next.js and Material UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <MUIThemeProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <Alert />
              <main style={{ flex: 1 }}>
                {children}
              </main>
            </div>
          </MUIThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
