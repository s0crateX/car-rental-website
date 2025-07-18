import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/context/auth-provider";

const poppins = localFont({
  src: [
    {
      path: "../../public/assets/fonts/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/Poppins-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/assets/fonts/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/Poppins-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "GenRide - Premium Car Rental Service",
  description: "Experience premium car rentals with GenRide. Find and rent your perfect vehicle today.",
  icons: {
    icon: "/assets/images/favicon.ico",
    apple: "/assets/images/apple-touch-icon.png",
  },
};

import { Toaster } from "sonner";

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // Suppress Firebase auth errors from showing in console
    if (event.reason?.code?.includes('auth/') || event.reason?.message?.includes('Firebase')) {
      event.preventDefault();
      console.log('Firebase auth error handled:', event.reason.code);
      return;
    }
  });
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans`}>
        <AuthProvider>
          <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        </AuthProvider>
          <Toaster />
      </body>
    </html>
  );
}
