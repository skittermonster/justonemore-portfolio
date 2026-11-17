import type { Metadata } from 'next';
import './globals.css';
import { AudioPlayerProvider } from '@/context/AudioPlayerContext';
import { TransportBar } from '@/components/TransportBar';

export const metadata: Metadata = {
  title: 'JustOneMore // Ethan Lum — Audio Engineering, DSP & Sound Design',
  description: 'Fast, tactile portfolio of Ethan Lum (JustOneMore) - Audio Engineer, DSP Developer, Sound Designer & Music Producer.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0A0A0C] text-[#F3F4F6] selection:bg-[#FF9F1C] selection:text-[#0A0A0C] antialiased">
        <AudioPlayerProvider>
          <div className="relative min-h-screen flex flex-col">
            {children}
            <TransportBar />
          </div>
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
