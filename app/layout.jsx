import { Press_Start_2P, VT323 } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/layout/Providers';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/constants';
import { siteUrl } from '@/lib/site';

const pixelFont = Press_Start_2P({ weight: '400', subsets: ['latin'], variable: '--font-pixel', display: 'swap' });
const terminalFont = VT323({ weight: '400', subsets: ['latin'], variable: '--font-terminal', display: 'swap' });

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_TAGLINE,
  openGraph: { siteName: SITE_NAME, type: 'website' },
  alternates: { types: { 'application/rss+xml': '/feed.xml' } },
};

export const viewport = {
  themeColor: '#0b0820',
  colorScheme: 'dark',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${pixelFont.variable} ${terminalFont.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only z-50 bg-teal-300 px-3 py-2 font-bold text-ink focus:not-sr-only focus:fixed focus:left-2 focus:top-2"
        >
          Skip to content
        </a>
        <Providers>
          <Header />
          <main id="main" tabIndex={-1} className="container-page flex-1 pt-8 focus:outline-none sm:pt-10">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
