import React, { useState } from 'react';
import { AccessoryItemData, PlugOption } from './AccessoriesPage.tsx';
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
  ShoppingBag,
  CheckCircle,
  Truck,
  Package,
  Layers,
  Globe,
  Check,
} from 'lucide-react';

interface AccessoryProductProps {
  accessory: AccessoryItemData;
  onNavigateBack: () => void;
  onAddToBasket: (accessory: AccessoryItemData, plug?: PlugOption) => void;
  onNavigateToCatalog: () => void;
}

export const AccessoryProduct: React.FC<AccessoryProductProps> = ({
  accessory,
  onNavigateBack,
  onAddToBasket,
  onNavigateToCatalog,
}) => {
  const [selectedPlugId, setSelectedPlugId] = useState<'uk' | 'eu' | 'canada'>('uk');
  const [justAdded, setJustAdded] = useState(false);

  const currentPlugOption = accessory.plugOptions?.find((p) => p.id === selectedPlugId);
  const activeImage = currentPlugOption ? currentPlugOption.image : accessory.image;

  const handleAdd = () => {
    onAddToBasket(accessory, currentPlugOption);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="space-y-12 py-10 px-4 sm:px-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Top Bar: Return to Catalog & Navigation */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateBack}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Accessories</span>
          </button>
          <span className="text-slate-600">&bull;</span>
          <button
            onClick={onNavigateToCatalog}
            className="text-xs text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            Heated Gloves Lineup
          </button>
        </div>

        {/* Stock & Origin Badge */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>In Stock &bull; Gothenburg Hub</span>
          </span>
        </div>
      </div>

      {/* Main Accessory Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        
        {/* Left: Product Visual Frame */}
        <div className="md:col-span-5 flex flex-col items-center justify-between p-5 sm:p-6 rounded-3xl bg-[#12151c] border border-white/10 min-h-[480px] sm:min-h-[520px] relative overflow-hidden group shadow-2xl">
          
          {/* Top Indicators */}
          <div className="w-full flex items-center justify-between z-10 text-xs pb-2">
            <span className="px-2.5 py-1 bg-black/60 rounded-full text-[11px] text-slate-300 border border-white/10 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{accessory.category}</span>
            </span>

            {currentPlugOption ? (
              <span className="px-2.5 py-1 bg-black/80 rounded-full text-[11px] font-mono text-emerald-400 border border-emerald-400/30 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>{currentPlugOption.badge}</span>
              </span>
            ) : (
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Studio Capture
              </span>
            )}
          </div>

          {/* Centered Product Photo */}
          <div className="w-full flex-1 flex items-center justify-center py-4 my-auto">
            <div className="w-full h-full min-h-[380px] sm:min-h-[430px] flex items-center justify-center rounded-2xl bg-[#0e1117] p-4">
              <img
                key={activeImage}
                src={activeImage}
                alt={`${accessory.name} ${currentPlugOption ? currentPlugOption.name : ''}`}
                className="w-full h-auto max-h-[450px] max-w-[290px] sm:max-w-[320px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] hover:scale-104 transition-all duration-300 rounded-lg mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          
          {/* Bottom Caption */}
          <div className="w-full pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>
              {currentPlugOption
                ? `PLUG: ${currentPlugOption.name.toUpperCase()}`
                : 'OFFICIAL ARCTIQ COMPONENT'}
            </span>
            <span>GOTHENBURG, SWEDEN</span>
          </div>
        </div>

        {/* Right: Product Details & Add to Basket */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Header */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] text-slate-400">
              <span>{accessory.category}</span>
              <span>&bull;</span>
              <span className="text-emerald-400">Verified Compatible</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
              {accessory.name}
            </h1>
            
            <div className="pt-1 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white font-['Space_Grotesk']">
                {accessory.price}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Free UK &amp; EU express delivery included
              </span>
            </div>
          </div>

          {/* Full Description */}
          <p className="text-slate-300 text-sm leading-relaxed">
            {accessory.description}
          </p>

          {/* Plug Standard Selection (Specifically for Arctiq Charger with UK, EU, Canada) */}
          {accessory.plugOptions && (
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-slate-300">
                  Select Wall Plug Standard:
                </span>
                <span className="text-emerald-400 font-mono font-bold">
                  {currentPlugOption?.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {accessory.plugOptions.map((plug) => {
                  const isSelected = selectedPlugId === plug.id;
                  return (
                    <button
                      key={plug.id}
                      type="button"
                      onClick={() => setSelectedPlugId(plug.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'border-white bg-white text-black shadow-lg ring-1 ring-white/40'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${isSelected ? 'text-black' : 'text-slate-400'}`}>
                          {plug.id.toUpperCase()} Standard
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="font-['Space_Grotesk'] font-bold text-xs leading-tight">
                          {plug.name}
                        </div>
                        <div className={`text-[11px] leading-tight ${isSelected ? 'text-slate-700' : 'text-slate-400'}`}>
                          {plug.pinType}
                        </div>
                      </div>

                      <div className={`text-[10px] font-medium pt-1 border-t ${isSelected ? 'border-black/15 text-slate-800' : 'border-white/10 text-slate-500'}`}>
                        {plug.badge}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Compatibility Banner */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <span className="font-semibold text-white block">Compatibility Assurance</span>
              <span className="text-slate-400 leading-snug">{accessory.compatibility}</span>
            </div>
          </div>

          {/* Key Engineering Features */}
          <div className="space-y-2.5 pt-2 border-t border-white/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
              Key Engineering Highlights
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {accessory.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#12151c] border border-white/10 flex items-center gap-2.5 text-slate-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="text-[12px] font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Action Button: "Add to Basket" */}
          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={handleAdd}
              className={`w-full py-4 font-bold uppercase tracking-wider text-xs rounded-xl transition duration-150 cursor-pointer shadow-lg flex items-center justify-center gap-2 ${
                justAdded
                  ? 'bg-emerald-400 text-black'
                  : 'bg-white text-black hover:bg-slate-200'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>
                    Added {currentPlugOption ? `(${currentPlugOption.name})` : ''} to Basket!
                  </span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    Add to Basket &bull; {accessory.price}
                    {currentPlugOption ? ` (${currentPlugOption.id.toUpperCase()})` : ''}
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Includes 2-Year Warranty &bull; 30-Day Nordic Trial &bull; Free Global Shipping</span>
            </div>
          </div>

        </div>

      </div>

      {/* Technical Specifications Section */}
      <div className="space-y-4 border-t border-white/10 pt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Technical Specifications ({accessory.name})
          </h2>
          <span className="text-[11px] font-mono text-slate-500">
            SWEDISH WINTER VALIDATION
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Category</span>
            </div>
            <p className="font-bold text-white text-sm">{accessory.category}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              <span>Output / Power</span>
            </div>
            <p className="font-bold text-white text-sm">
              {accessory.id === 'fast-charger' ? '30W Dual USB-C GaN' : accessory.price}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Wall Socket Format</span>
            </div>
            <p className="font-bold text-white text-sm">
              {accessory.plugOptions
                ? `${currentPlugOption?.name}`
                : 'Universal / Nordic Spec'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Warranty</span>
            </div>
            <p className="font-bold text-white text-sm">2 Years Full Replacement</p>
          </div>

          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Truck className="w-3.5 h-3.5 text-slate-300" />
              <span>Logistics Terminal</span>
            </div>
            <p className="font-bold text-white text-sm">Gothenburg, Sweden</p>
          </div>

          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>Compatibility</span>
            </div>
            <p className="font-bold text-white text-xs leading-tight">{accessory.compatibility}</p>
          </div>
        </div>
      </div>

    </div>
  );
};
