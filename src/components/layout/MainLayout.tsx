import React, { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import LiquidBackground from './LiquidBackground';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  variant?: 'subtle' | 'normal' | 'intense';
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'Explain My Repo',
  description = 'AI-powered repository analysis tool',
  variant = 'normal',
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Luka" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <LiquidBackground variant={variant} />
        <Header />
        <main className="flex-1 pt-20 pb-8">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
