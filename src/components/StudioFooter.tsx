'use client';

import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Terminal, Cpu, ShieldCheck, Heart } from 'lucide-react';

interface StudioFooterProps {
  metadata: PortfolioData['metadata'];
}

export function StudioFooter({ metadata }: StudioFooterProps) {
  return (
    <footer className="py-12 border-t border-[#26262E] bg-[#0A0A0D] text-[#8E929F] text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#1E1E26]">
          
          {/* Signal Chain Architecture */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#F3F4F6] uppercase mb-2">
              <Terminal className="w-3.5 h-3.5 text-[#FF9F1C]" />
              <span>SIGNAL PATH ARCHITECTURE</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#8E929F]">
              Engineered with zero external library bloat. Real-time audio powered by native React Context, standard HTML5 Audio, and Web Audio API procedural DSP graph.
            </p>
          </div>

          {/* Calibrated Specs */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#F3F4F6] uppercase mb-2">
              <Cpu className="w-3.5 h-3.5 text-[#10B981]" />
              <span>SYSTEM SPECIFICATIONS</span>
            </div>
            <ul className="text-[11px] space-y-1">
              <li>• Sample Rate: <span className="text-[#F3F4F6]">{metadata.sampleRate}</span></li>
              <li>• Static Export: <span className="text-[#F3F4F6]">Next.js SSG for GitHub Pages</span></li>
              <li>• Data Architecture: <span className="text-[#F3F4F6]">Single-source JSON configuration</span></li>
            </ul>
          </div>

          {/* Brand Credits */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#F3F4F6] uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF9F1C]" />
              <span>JUSTONEMORE AUDIO</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#8E929F]">
              Portfolio of Ethan Lum. Designed with exposed 1px grid lines and tactile hardware studio rack aesthetic.
            </p>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div>
            © {new Date().getFullYear()} {metadata.brand} // {metadata.engineer}. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[#8E929F]">
            <a href={metadata.links.github} className="hover:text-[#F3F4F6] transition-colors">
              GitHub
            </a>
            <span>•</span>
            <a href={metadata.links.email} className="hover:text-[#F3F4F6] transition-colors">
              Email
            </a>
            {metadata.links.youtube && (
              <>
                <span>•</span>
                <a href={metadata.links.youtube} className="hover:text-[#F3F4F6] transition-colors">
                  YouTube
                </a>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
