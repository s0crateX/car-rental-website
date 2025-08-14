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
  title: "GenRide Portal - Car Rental Management System | Admin Dashboard",
  description: "GenRide Portal is a comprehensive car rental management platform for General Santos City. Manage fleet operations, user accounts, document verification, and rental bookings with our advanced admin dashboard. Streamline your car rental business with real-time analytics, automated workflows, and secure document management.",
  keywords: "car rental management, fleet management system, General Santos City car rental, vehicle rental platform, admin dashboard, car booking system, rental management software, Philippines car rental, GenRide portal, automotive management",
  authors: [{ name: "GenRide Team" }],
  creator: "GenRide",
  publisher: "GenRide",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.genride-portal.com",
    siteName: "GenRide Portal",
    title: "GenRide Portal - Advanced Car Rental Management System",
    description: "Professional car rental management platform for General Santos City. Complete fleet management, user verification, and booking administration in one powerful dashboard.",
    images: [
      {
        url: "/assets/images/logo.png",
        width: 1200,
        height: 630,
        alt: "GenRide Portal - Car Rental Management System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GenRide Portal - Car Rental Management System",
    description: "Comprehensive car rental management platform for General Santos City. Manage your fleet, users, and bookings efficiently.",
    images: ["/assets/images/logo.png"],
    creator: "@GenRide",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  category: "Business Software",
  classification: "Car Rental Management System",
  icons: {
    icon: "/assets/images/favicon.ico",
    apple: "/assets/images/apple-touch-icon.png",
    shortcut: "/assets/images/favicon.ico",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://www.genride-portal.com",
  },
};


import { Toaster } from "sonner";
import { StructuredData, LocalBusinessStructuredData } from "@/components/seo/structured-data";

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
      <head>
        <StructuredData />
        <LocalBusinessStructuredData />
      </head>
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
