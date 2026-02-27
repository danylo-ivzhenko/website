import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "danylevskii.space",
  description: "Explore tv studios and their series collections.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-512.png",
    apple: "/icon-512.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#3a3a3a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <Navbar />
        <main className="main-container">{children}</main>
        <footer className="site-footer">
          <div className="footer-inner">
            <span className="footer-copy">© All Rights Copied</span>
            <a
              href="https://t.me/danylevskii_reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-telegram"
            >
              <Image
                src="/telegram.svg"
                alt="Telegram"
                width={40}
                height={40}
              />
            </a>
          </div>
        </footer>

        {/* Service Worker registration for PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
