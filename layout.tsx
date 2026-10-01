import type { Metadata, Viewport } from 'next';
import './globals.css';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'Mortgage Freedom Planner',
  description: 'See your mortgage-free date, model overpayment strategies, and build a plan toward property wealth.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Freedom Planner'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0B1E3D'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-canvas text-ink min-h-screen">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
