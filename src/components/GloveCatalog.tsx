import React from 'react';
import { GloveModelType, GloveColourType } from '../types.ts';
import { ArrowRight, Flame, Shield, Sparkles, Check } from 'lucide-react';

import blackAdultPhoto from '../assets/images/arctiq_glove_thinner_1793917309237.jpg';
import whiteAdultPhoto from '../assets/images/arctiq_glove_white_1793974422249.jpg';
import blackKidsPhoto from '../assets/images/arctiq_glove_kids_1793974436351.jpg';

interface GloveCatalogProps {
  onSelectGlove: (model: GloveModelType, colour: GloveColourType) => void;
  onDirectOrder: (model: GloveModelType, colour: GloveColourType) => void;
}

export const GloveCatalog: React.FC<GloveCatalogProps> = ({
  onSelectGlove,
  onDirectOrder,
}) => {
  const gloveItems: Array<{
    id: string;
    model: GloveModelType;
    colour: GloveColourType;
    title: string;
    editionBadge: string;
    colourName: string;
    price: string;
    image: string;
    tagline: string;
    tempMax: string;
    batteryRuntime: string;
  }> = [
    {
      id: 'adult-black',
      model: 'adult',
      colour: 'black',
      title: 'Arctiq HeatGlove',
      editionBadge: 'Adult Edition',
      colourName: 'Obsidian Black',
      price: '£159.99',
      image: blackAdultPhoto,
      tagline: 'Flagship sub-zero technical heated glove in stealth matte black.',
      tempMax: 'Max 45°C',
      batteryRuntime: 'Up to 10h',
    },
    {
      id: 'adult-white',
      model: 'adult',
      colour: 'white',
      title: 'Arctiq HeatGlove',
      editionBadge: 'Adult Edition',
      colourName: 'Arctic White',
      price: '£159.99',
      image: whiteAdultPhoto,
      tagline: 'High-visibility snow edition with contrasting black cinch hardware.',
      tempMax: 'Max 45°C',
      batteryRuntime: 'Up to 10h',
    },
    {
      id: 'kids-black',
      model: 'kids',
      colour: 'black',
      title: 'Arctiq HeatGlove Kids',
      editionBadge: 'Junior Edition',
      colourName: 'Obsidian Black',
      price: '£119.99',
      image: blackKidsPhoto,
      tagline: 'Youth ergonomic cut with 3M reflective safety piping & safe heat throttling.',
      tempMax: 'Max 40°C (Junior Safe)',
      batteryRuntime: 'Up to 10h',
    },
    {
      id: 'kids-white',
      model: 'kids',
      colour: 'white',
      title: 'Arctiq HeatGlove Kids',
      editionBadge: 'Junior Edition',
      colourName: 'Arctic White',
      price: '£119.99',
      image: whiteAdultPhoto,
      tagline: 'Clean alpine white edition tailored for young skiers & winter explorers.',
      tempMax: 'Max 40°C (Junior Safe)',
      batteryRuntime: 'Up to 10h',
    },
  ];

  return (
    <div className="py-10 px-4 sm:px-6 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>The Heated Glove Lineup</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
          Arctiq HeatGlove Collection
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Choose between our flagship Adult Edition and Junior Kids Edition, available in Obsidian Black and Arctic White. Click any glove to view full specifications, interactive thermal matrix, and sizing.
        </p>
      </div>

      {/* 4-Item Glove Grid (Separated by model & colour) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {gloveItems.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col justify-between rounded-3xl bg-[#12151c] border border-white/10 hover:border-white/30 transition-all duration-300 shadow-xl overflow-hidden"
          >
            {/* Clickable Image Container */}
            <button
              type="button"
              onClick={() => onSelectGlove(item.model, item.colour)}
              className="w-full relative aspect-[3/4] p-4 flex items-center justify-center bg-[#0d0f15] cursor-pointer overflow-hidden text-left"
              aria-label={`View ${item.title} in ${item.colourName}`}
            >
              <img
                src={item.image}
                alt={`${item.title} - ${item.colourName}`}
                className="w-full h-full object-contain max-h-[300px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
              />

              {/* Badges Overlay */}
              <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-full text-[10px] font-semibold text-white border border-white/10">
                  {item.editionBadge}
                </span>
              </div>

              <div className="absolute bottom-3 right-3 z-10">
                <span className="px-2 py-0.5 rounded-full bg-black/70 border border-white/10 text-[10px] text-slate-300 font-mono">
                  {item.colourName}
                </span>
              </div>
            </button>

            {/* Information & Action Area */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    {item.colourName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-3 h-3 rounded-full border ${
                        item.colour === 'black'
                          ? 'bg-black border-white/50'
                          : 'bg-white border-black/40'
                      }`}
                    />
                  </div>
                </div>

                {/* Clickable Title */}
                <button
                  type="button"
                  onClick={() => onSelectGlove(item.model, item.colour)}
                  className="text-left font-['Space_Grotesk'] font-bold text-lg text-white group-hover:text-emerald-400 transition-colors cursor-pointer block"
                >
                  {item.title}
                </button>

                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {item.tagline}
                </p>

                {/* Quick specs pills */}
                <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-300 font-mono">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                    {item.tempMax}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                    {item.batteryRuntime}
                  </span>
                </div>
              </div>

              {/* Price & Buttons */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="font-['Space_Grotesk'] text-xl font-extrabold text-white">
                    {item.price}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                    Free Express Shipping
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onSelectGlove(item.model, item.colour)}
                    className="w-full py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 text-white font-semibold text-xs transition cursor-pointer text-center"
                  >
                    View Specs
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectGlove(item.model, item.colour)}
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer text-center shadow-md"
                  >
                    Select Size
                  </button>
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
