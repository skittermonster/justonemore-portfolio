'use client';

import React, { useState } from 'react';
import portfolioDataRaw from '@/data/projects.json';
import { PortfolioData } from '@/types/portfolio';
import { Header } from '@/components/Header';
import { VstDspSection } from '@/components/VstDspSection';
import { SoundDesignSection } from '@/components/SoundDesignSection';
import { MusicSection } from '@/components/MusicSection';
import { StudioFooter } from '@/components/StudioFooter';

const portfolioData = portfolioDataRaw as unknown as PortfolioData;

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'vst_dsp' | 'sound_design' | 'music'>('ALL');

  return (
    <div className="flex-1 pb-28 rack-bg-pattern min-h-screen">
      {/* Top Signal Header */}
      <Header
        metadata={portfolioData.metadata}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />

      {/* Main Studio Workbench Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        
        {/* Section 1: VSTs, DSP & Audio Pipelines */}
        {(activeFilter === 'ALL' || activeFilter === 'vst_dsp') && (
          <VstDspSection projects={portfolioData.vst_dsp} />
        )}

        {/* Section 2: Sound Design & Visual Media + 3x3 Sampler Rack */}
        {(activeFilter === 'ALL' || activeFilter === 'sound_design') && (
          <SoundDesignSection
            projects={portfolioData.sound_design.projects}
            pads={portfolioData.sound_design.soundboardPads}
          />
        )}

        {/* Section 3: Music Production & Vocal Synth */}
        {(activeFilter === 'ALL' || activeFilter === 'music') && (
          <MusicSection tracks={portfolioData.music} />
        )}

      </main>

      {/* Studio Hardware Footer */}
      <StudioFooter metadata={portfolioData.metadata} />
    </div>
  );
}
