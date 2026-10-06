import { Press_Start_2P, VT323 } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { NavSidebar } from '@/components/layout/NavSidebar';
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
  themeColor: '#4f1fa3',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${pixelFont.variable} ${terminalFont.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-50 bg-teal-300 px-3 py-2 font-bold text-ink focus:not-sr-only focus:fixed focus:left-2 focus:top-2"
        >
          Skip to content
        </a>
        <Providers>
          <div className="mx-auto max-w-5xl px-2 py-4 sm:px-4">
            <Header />
            <div className="mt-4 grid gap-4 md:grid-cols-[11rem_minmax(0,1fr)]">
              <NavSidebar />
              <main id="main" tabIndex={-1} className="min-w-0 focus:outline-none">
                {children}
              </main>
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
