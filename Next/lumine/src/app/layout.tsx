import type { Metadata } from 'next';
import { ToastProvider } from '@/components/Toast';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Lumine — Biblioteca Comunitária Ler é Viver',
  description: 'Sistema de gestão bibliotecária comunitária: acervo público, empréstimos e controle de devoluções.',
  keywords: ['biblioteca', 'livros', 'empréstimos', 'acervo', 'leitura comunitária', 'Lumine'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* App Router root layout loads these fonts site-wide. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
