'use client';

import React from 'react';
import { Mail, Music, Terminal, Cpu, ExternalLink } from 'lucide-react';
import { GithubIcon, YoutubeIcon, SoundcloudIcon } from '@/components/Icons';
import { PortfolioData } from '@/types/portfolio';

interface HeaderProps {
  metadata: PortfolioData['metadata'];
  activeFilter: 'ALL' | 'vst_dsp' | 'sound_design' | 'music';
  onSelectFilter: (filter: 'ALL' | 'vst_dsp' | 'sound_design' | 'music') => void;
}

export function Header({ metadata, activeFilter, onSelectFilter }: HeaderProps) {
  const scrollToSection = (id: string, filter: 'ALL' | 'vst_dsp' | 'sound_design' | 'music') => {
    onSelectFilter(filter);
    if (filter !== 'ALL') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className="border-b border-[#26262E] bg-[#0C0C0F] relative">
      {/* Top Hardware Telemetry Strip */}
      <div className="bg-[#08080A] border-b border-[#1E1E26] px-4 py-1.5 text-[11px] font-mono text-[#8E929F] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#10B981]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            {metadata.dspStatus}
          </span>
          <span className="text-[#3A3A48]">|</span>
          <span className="hidden sm:inline">FS: <strong className="text-[#C5C8D4]">{metadata.sampleRate}</strong></span>
          <span className="hidden md:inline text-[#3A3A48]">|</span>
          <span className="hidden md:inline">SYSTEM: <strong className="text-[#C5C8D4]">AUDIO WORKBENCH v1.0</strong></span>
        </div>

        <div className="flex items-center gap-4 text-[10px]">
          <span className="text-[#8E929F]">LOCATION: <span className="text-[#F3F4F6]">{metadata.location}</span></span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF9F1C] uppercase tracking-wider mb-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>Studio Rack System // Portfolio</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F3F4F6]">
              {metadata.brand} <span className="text-[#8E929F] font-normal">// {metadata.engineer}</span>
            </h1>

            <p className="mt-2 text-sm sm:text-base text-[#8E929F] max-w-2xl font-normal leading-relaxed">
              {metadata.bio}
            </p>
          </div>

          {/* External Links & Hardware Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={metadata.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded bg-[#14141A] hover:bg-[#1D1D26] border border-[#2E2E3A] hover:border-[#424254] text-xs font-mono text-[#F3F4F6] flex items-center gap-1.5 transition-all"
            >
              <GithubIcon className="w-3.5 h-3.5 text-[#FF9F1C]" />
              <span>GITHUB</span>
              <ExternalLink className="w-3 h-3 text-[#8E929F]" />
            </a>

            <a
              href={metadata.links.email}
              className="px-3 py-1.5 rounded bg-[#14141A] hover:bg-[#1D1D26] border border-[#2E2E3A] hover:border-[#424254] text-xs font-mono text-[#F3F4F6] flex items-center gap-1.5 transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-[#10B981]" />
              <span>CONTACT</span>
            </a>

            {metadata.links.youtube && (
              <a
                href={metadata.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded bg-[#14141A] hover:bg-[#1D1D26] border border-[#2E2E3A] hover:border-[#424254] text-xs font-mono text-[#F3F4F6] flex items-center gap-1.5 transition-all"
              >
                <YoutubeIcon className="w-3.5 h-3.5 text-[#EF4444]" />
                <span>YOUTUBE</span>
              </a>
            )}

            {metadata.links.soundcloud && (
              <a
                href={metadata.links.soundcloud}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded bg-[#14141A] hover:bg-[#1D1D26] border border-[#2E2E3A] hover:border-[#424254] text-xs font-mono text-[#F3F4F6] flex items-center gap-1.5 transition-all"
              >
                <SoundcloudIcon className="w-3.5 h-3.5 text-[#FF9F1C]" />
                <span>SOUNDCLOUD</span>
              </a>
            )}
          </div>
        </div>

        {/* Category Navigation Strip */}
        <div className="mt-8 pt-4 border-t border-[#1C1C24] flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-[#8E929F] uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#FF9F1C]" />
            <span>MODULE CHANNELS:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectFilter('ALL')}
              className={`px-3 py-1 rounded text-xs font-mono transition-all border ${
                activeFilter === 'ALL'
                  ? 'bg-[#FF9F1C] border-[#FFAF38] text-[#0A0A0C] font-bold shadow-[0_0_12px_rgba(255,159,28,0.3)]'
                  : 'bg-[#121217] text-[#8E929F] hover:text-[#F3F4F6] border-[#26262E] hover:border-[#3A3A48]'
              }`}
            >
              [ALL MODULES]
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('section-vst-dsp', 'vst_dsp')}
              className={`px-3 py-1 rounded text-xs font-mono transition-all border ${
                activeFilter === 'vst_dsp'
                  ? 'bg-[#FF9F1C] border-[#FFAF38] text-[#0A0A0C] font-bold shadow-[0_0_12px_rgba(255,159,28,0.3)]'
                  : 'bg-[#121217] text-[#8E929F] hover:text-[#F3F4F6] border-[#26262E] hover:border-[#3A3A48]'
              }`}
            >
              [01 // VST & DSP]
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('section-sound-design', 'sound_design')}
              className={`px-3 py-1 rounded text-xs font-mono transition-all border ${
                activeFilter === 'sound_design'
                  ? 'bg-[#FF9F1C] border-[#FFAF38] text-[#0A0A0C] font-bold shadow-[0_0_12px_rgba(255,159,28,0.3)]'
                  : 'bg-[#121217] text-[#8E929F] hover:text-[#F3F4F6] border-[#26262E] hover:border-[#3A3A48]'
              }`}
            >
              [02 // SOUND DESIGN & SFX]
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('section-music', 'music')}
              className={`px-3 py-1 rounded text-xs font-mono transition-all border ${
                activeFilter === 'music'
                  ? 'bg-[#FF9F1C] border-[#FFAF38] text-[#0A0A0C] font-bold shadow-[0_0_12px_rgba(255,159,28,0.3)]'
                  : 'bg-[#121217] text-[#8E929F] hover:text-[#F3F4F6] border-[#26262E] hover:border-[#3A3A48]'
              }`}
            >
              [03 // PRODUCTION & MIXES]
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
