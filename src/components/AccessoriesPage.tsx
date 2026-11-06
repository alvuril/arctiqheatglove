import React, { useState } from 'react';
import { ShoppingBag, Zap, CheckCircle, Globe } from 'lucide-react';

import batteryImg from '../assets/images/arctiq_battery_pack_fixed_1793977040085.jpg';
import chargerUkImg from '../assets/images/arctiq_accessory_charger_1793975461775.jpg';
import chargerEuImg from '../assets/images/arctiq_charger_eu_1793981100359.jpg';
import chargerCanadaImg from '../assets/images/arctiq_charger_canada_1793981100750.jpg';
import caseImg from '../assets/images/arctiq_accessory_case_1793975476637.jpg';
import leashesImg from '../assets/images/arctiq_accessory_leashes_1793975490681.jpg';

export interface PlugOption {
  id: 'uk' | 'eu' | 'canada';
  name: string;
  badge: string;
  pinType: string;
  image: string;
}

export interface AccessoryItemData {
  id: string;
  name: string;
  category: string;
  price: string;
  numericPrice: number;
  image: string;
  description: string;
  features: string[];
  compatibility: string;
  stockStatus: string;
  plugOptions?: PlugOption[];
}

export const ARCTIQ_ACCESSORIES: AccessoryItemData[] = [
  {
    id: 'battery-pair',
    name: 'Arctiq 7.4V Dual Battery Pack (Pair)',
    category: 'Power & Endurance',
    price: '£39.99',
    numericPrice: 39.99,
    image: batteryImg,
    description:
      'Engineered specifically with a flat base and ergonomic curved top contour. Features integrated side slide-in locking rails positioned low along the base edge to snap securely into the glove wrist cuff, with a single dedicated USB-C port and 4 micro-LED status lights.',
    features: [
      'Ergonomic Curved Top & Flat Base',
      'Low-Profile Side Locking Rails for Glove Cuff',
      'Dedicated USB-C Only Charging & Output',
      '3000mAh Cold-Weather Density / Cell',
    ],
    compatibility: 'Compatible with Arctiq HeatGlove Adult & Kids Editions',
    stockStatus: 'Gothenburg Hub: 92 units in stock',
  },
  {
    id: 'fast-charger',
    name: 'Arctiq 30W Dual USB-C Fast Charger',
    category: 'Charging & Cables',
    price: '£19.99',
    numericPrice: 19.99,
    image: chargerUkImg,
    description:
      'Dual-port 30W GaN rapid wall adapter bundled with two heavy-duty braided black USB-C cables. Available in UK, EU, and Canada wall socket editions. Recharges both glove power cells from zero to full in just 1.8 hours.',
    features: [
      'Dual USB-C 30W Output',
      'UK, EU & Canada Plug Options',
      '2x Braided 1.2m Cables Included',
      'Overheat & Surge Safeguard',
    ],
    compatibility: 'Universal USB-C / Arctiq Battery Packs',
    stockStatus: 'Gothenburg Hub: 145 units in stock',
    plugOptions: [
      {
        id: 'uk',
        name: 'UK Plug (Type G)',
        badge: 'UK & Ireland',
        pinType: '3-Pin Rectangular',
        image: chargerUkImg,
      },
      {
        id: 'eu',
        name: 'EU Plug (Type C/F)',
        badge: 'Continental Europe',
        pinType: '2-Pin Round Europlug',
        image: chargerEuImg,
      },
      {
        id: 'canada',
        name: 'Canada Plug (Type A)',
        badge: 'Canada & USA',
        pinType: '2-Pin Flat Parallel',
        image: chargerCanadaImg,
      },
    ],
  },
  {
    id: 'travel-case',
    name: 'Arctiq Hard-Shell Protective Storage Case',
    category: 'Protection & Storage',
    price: '£24.99',
    numericPrice: 24.99,
    image: caseImg,
    description:
      'Custom-molded EVA protective travel case wrapped in high-tenacity ballistic fabric with a weather-sealed zipper. Keeps heated gloves, battery cells, and charger organized and dry.',
    features: [
      'Shockproof EVA Construction',
      'Weather-Sealed Zipper',
      'Internal Cable Mesh Pocket',
      'Glove-Friendly Zipper Pull',
    ],
    compatibility: 'Holds 1 Pair of HeatGloves + 2 Battery Packs + Cables',
    stockStatus: 'Gothenburg Hub: 78 units in stock',
  },
  {
    id: 'storm-leashes',
    name: 'Arctiq Elastic Storm Leashes (Pair)',
    category: 'Safety & Hardware',
    price: '£12.99',
    numericPrice: 12.99,
    image: leashesImg,
    description:
      'High-elasticity wrist retention tethers with soft woven cuffs, 3M reflective safety stitching, and quick-release anodized aluminum carabiners to prevent dropping gloves on chairlifts.',
    features: [
      'High-Strength Elastic Webbing',
      '3M Reflective Safety Stitching',
      'Anodized Black Aluminum Carabiners',
      'Skin-Friendly Hypoallergenic Band',
    ],
    compatibility: 'Compatible with all Arctiq Heated & Technical Gloves',
    stockStatus: 'Gothenburg Hub: 180 units in stock',
  },
];

interface AccessoriesPageProps {
  onSelectAccessory: (accessory: AccessoryItemData) => void;
  onAddAccessory: (accessory: AccessoryItemData, plug?: PlugOption) => void;
  onNavigateToGloves: () => void;
}

export const AccessoriesPage: React.FC<AccessoriesPageProps> = ({
  onSelectAccessory,
  onAddAccessory,
  onNavigateToGloves,
}) => {
  // Local card preview state for accessories with plug options
  const [selectedChargerPlug, setSelectedChargerPlug] = useState<'uk' | 'eu' | 'canada'>('uk');

  const getCardImage = (item: AccessoryItemData) => {
    if (item.id === 'fast-charger' && item.plugOptions) {
      const match = item.plugOptions.find((p) => p.id === selectedChargerPlug);
      return match ? match.image : item.image;
    }
    return item.image;
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Arctiq Technical Accessories</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
          Gear &amp; Modular Accessories
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Explore replacement battery packs, rapid dual chargers with UK, EU, and Canada plug standards, protective travel cases, and mountain safety leashes.
        </p>
      </div>

      {/* Scrollable Accessories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ARCTIQ_ACCESSORIES.map((item) => {
          const cardImg = getCardImage(item);
          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-3xl bg-[#12151c] border border-white/10 hover:border-white/30 transition-all duration-300 shadow-xl overflow-hidden group"
            >
              {/* Clickable Image Container */}
              <button
                type="button"
                onClick={() => onSelectAccessory(item)}
                className="relative aspect-[3/4] p-4 flex items-center justify-center bg-[#0d0f15] overflow-hidden cursor-pointer w-full text-left"
                aria-label={`View ${item.name}`}
              >
                <img
                  src={cardImg}
                  alt={item.name}
                  className="w-full h-full object-contain max-h-[300px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                  <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-full text-[10px] font-semibold text-slate-300 border border-white/10">
                    {item.category}
                  </span>
                </div>

                {item.plugOptions && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md rounded-full text-[10px] font-mono text-emerald-400 border border-emerald-400/30 flex items-center gap-1">
                      <Globe className="w-2.5 h-2.5" />
                      <span>{selectedChargerPlug.toUpperCase()} Plug</span>
                    </span>
                  </div>
                )}
              </button>

              {/* Information & Action Area */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {/* Clickable Title */}
                  <button
                    type="button"
                    onClick={() => onSelectAccessory(item)}
                    className="font-['Space_Grotesk'] font-bold text-base text-white group-hover:text-amber-400 transition-colors text-left cursor-pointer block"
                  >
                    {item.name}
                  </button>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* If item has plug options, show interactive plug switcher pills on the card */}
                  {item.plugOptions && (
                    <div className="pt-1 space-y-1.5">
                      <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider block">
                        Wall Plug Standard:
                      </span>
                      <div className="grid grid-cols-3 gap-1 bg-[#0a0c10] p-1 rounded-xl border border-white/10">
                        {item.plugOptions.map((plug) => (
                          <button
                            key={plug.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedChargerPlug(plug.id);
                            }}
                            className={`py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center ${
                              selectedChargerPlug === plug.id
                                ? 'bg-white text-black shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {plug.id.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Compatibility notice */}
                  <div className="pt-1 text-[11px] text-slate-300 flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-400 text-[11px]">{item.compatibility}</span>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="pt-3 border-t border-white/10 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-['Space_Grotesk'] text-xl font-extrabold text-white block">
                        {item.price}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                        In Stock &bull; Gothenburg
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectAccessory(item)}
                      className="w-full py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 text-white font-semibold text-xs transition cursor-pointer text-center"
                    >
                      View Specs
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const currentPlug = item.plugOptions?.find((p) => p.id === selectedChargerPlug);
                        onAddAccessory(item, currentPlug);
                      }}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer text-center shadow-md flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Banner to Gloves */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#12151c] to-[#181d28] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white">
            Looking for the Arctiq Heated Gloves?
          </h3>
          <p className="text-xs text-slate-400">
            View our full lineup of Adult &amp; Kids editions in Obsidian Black and Arctic White.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToGloves}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shrink-0"
        >
          View HeatGlove Lineup
        </button>
      </div>

    </div>
  );
};
