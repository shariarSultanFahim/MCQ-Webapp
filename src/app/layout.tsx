import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";
import { Funnel_Display } from "next/font/google";
import "./globals.css";
import theme from "./theme";
// or `v1X-appRouter` if you are using Next.js v1X

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-display",
  preload: true,
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MCQ Web App",
  description:
    "Web-based MCQ exam platform designed specifically for private tutors in Bangladesh who need an efficient way to conduct tests for their students. The platform will eliminate the hassle of manually administering the same exam multiple times.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${funnelDisplay.variable} !font-sans antialiased`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
