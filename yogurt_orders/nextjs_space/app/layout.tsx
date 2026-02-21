import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
});

const bodyFont = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: "Mitch Seco - Yogurts, Jocoque y Mas",
  description: "Productos artesanales frescos: yogurts, jocoque, hummus y mas. Entrega a domicilio en Puebla y Cholula.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Mitch Seco - Productos Frescos",
    description: "Yogurts, jocoque, hummus y mas. Entrega a domicilio en Puebla y Cholula.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <Script src="https://apps.abacus.ai/chatllm/appllm-lib.js" strategy="afterInteractive" />
      </head>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} bg-stone-50 min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
