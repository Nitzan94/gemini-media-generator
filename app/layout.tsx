import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gemini Media Generator - AI-Powered Content Creation ✨",
  description: "Transform your ideas into amazing content with AI! Create enhanced prompts and get creative inspiration using Google's Gemini AI. Perfect for social media content creators.",
  keywords: ["AI", "Gemini", "content creation", "image generation", "creative writing", "social media", "viral content"],
  authors: [{ name: "Gemini Media Generator" }],
  creator: "Gemini Media Generator",
  publisher: "Gemini Media Generator",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'he_IL',
    url: 'https://gemini-media-generator.vercel.app',
    title: 'Gemini Media Generator - AI-Powered Content Creation ✨',
    description: 'Transform your ideas into amazing content with AI! Create enhanced prompts and get creative inspiration.',
    siteName: 'Gemini Media Generator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Gemini Media Generator - AI Content Creation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gemini Media Generator - AI-Powered Content Creation ✨',
    description: 'Transform your ideas into amazing content with AI!',
    creator: '@geminimedia',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="google-site-verification" content="your-verification-code" />
        
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Gemini Media Generator" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Gemini Media Generator" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Gemini Media Generator',
              description: 'AI-powered content creation tool using Google Gemini',
              url: 'https://gemini-media-generator.vercel.app',
              applicationCategory: 'DesignApplication',
              operatingSystem: 'All',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
