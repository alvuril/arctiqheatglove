import React, { useState } from 'react';
import { ProductInfo, GloveModelType, GloveColourType } from '../types.ts';
import { ThermalVisualizer } from './ThermalVisualizer.tsx';
import { ArrowLeft, ShieldCheck, Battery, Thermometer, Droplets, Feather, Shield, ShoppingBag, Check } from 'lucide-react';

interface GloveProductProps {
  products: {
    adult: ProductInfo;
    kids: ProductInfo;
  };
  selectedModel: GloveModelType;
  selectedColour: GloveColourType;
  selectedSize: string;
  onSizeChange: (size: string) => void;
  onNavigateHome: () => void;
  onNavigateToCatalog: () => void;
  onAddToBasket: (size: string) => void;
}

export const GloveProduct: React.FC<GloveProductProps> = ({
  products,
  selectedModel,
  selectedColour,
  selectedSize,
  onSizeChange,
  onNavigateHome,
  onNavigateToCatalog,
  onAddToBasket,
}) => {
  const [inventory, setInventory] = useState<Record<string, number> | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  const product = products[selectedModel];
  const colourwayObj = product.colourways.find((c) => c.id === selectedColour) || product.colourways[0];
  const activeImage = colourwayObj.image;
  const colourDisplayName = colourwayObj.name;

  React.useEffect(() => {
    fetch(`/api/product?model=${selectedModel}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data?.inventory) {
          setInventory(resData.data.inventory);
        }
      })
      .catch(() => {});
  }, [selectedModel]);

  const handleAddClick = () => {
    onAddToBasket(selectedSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="space-y-12 py-10 px-4 sm:px-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Top Bar: Return to Catalog & Navigation */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToCatalog}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Gloves</span>
          </button>
          <span className="text-slate-600">&bull;</span>
          <button
            onClick={onNavigateHome}
            className="text-xs text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            About Us
          </button>
        </div>

        {/* Static Model & Colour Indicator (No switching on individual page) */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white font-semibold">
            {selectedModel === 'adult' ? 'Adult Edition' : 'Junior Edition'}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
            <span
              className={`w-2.5 h-2.5 rounded-full border ${
                selectedColour === 'black' ? 'bg-black border-white/60' : 'bg-white border-black/40'
              }`}
            />
            <span className="text-slate-300">{colourDisplayName}</span>
          </span>
        </div>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        
        {/* Left: Product Visual Frame */}
        <div className="md:col-span-5 flex flex-col items-center justify-between p-5 sm:p-6 rounded-3xl bg-[#12151c] border border-white/10 min-h-[480px] sm:min-h-[520px] relative overflow-hidden group shadow-2xl">
          
          {/* Top Indicators */}
          <div className="w-full flex items-center justify-between z-10 text-xs pb-2">
            <span className="px-2.5 py-1 bg-black/60 rounded-full text-[11px] text-slate-300 border border-white/10 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{selectedModel === 'adult' ? 'Adult' : 'Junior Kids'} &bull; {colourDisplayName}</span>
            </span>

            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Studio Capture
            </span>
          </div>

          {/* Centered Product Photo */}
          <div className="w-full flex-1 flex items-center justify-center py-2 my-auto">
            <div className="w-full h-full min-h-[380px] sm:min-h-[430px] flex items-center justify-center rounded-2xl bg-[#12151c] p-1">
              <img
                src={activeImage}
                alt={`${product.name} in ${colourDisplayName}`}
                className="w-full h-auto max-h-[460px] max-w-[285px] sm:max-w-[310px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] hover:scale-102 transition-transform duration-500 rounded-lg mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          
          {/* Bottom Caption */}
          <div className="w-full pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>COLOUR: {colourDisplayName.toUpperCase()}</span>
            <span>HIGH-QUALITY MATERIALS</span>
          </div>
        </div>

        {/* Right: Product Details & Size Selection */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Header */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] text-slate-400">
              <span>{selectedModel === 'adult' ? 'Sub-Zero Nordic Series' : 'Junior Explorer Series'}</span>
              <span>&bull;</span>
              <span className="text-emerald-400">In Stock</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
              {product.name}
            </h1>
            
            <div className="pt-1 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white font-['Space_Grotesk']">
                {product.price}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Free UK &amp; EU express delivery included
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-300 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Static Selected Colourway Display (No switcher allowed on individual page) */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
              Colourway:
            </span>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-white/20 bg-white/10 text-xs font-semibold text-white max-w-xs">
              <span
                className={`w-4 h-4 rounded-full border shrink-0 ${
                  selectedColour === 'black' ? 'bg-black border-white/60' : 'bg-white border-black/30'
                }`}
              />
              <span>{colourDisplayName}</span>
            </div>
          </div>

          {/* Size Selector (Preserved and selectable!) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-slate-300">
                Select Size ({selectedModel === 'adult' ? 'Standard Adult' : 'Junior Youth'}):
              </span>
              <span className="text-emerald-400 font-bold">Selected: {selectedSize}</span>
            </div>
            
            <div className={`grid ${selectedModel === 'adult' ? 'grid-cols-4' : 'grid-cols-3'} gap-2.5`}>
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onSizeChange(sz)}
                  className={`py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                    selectedSize === sz
                      ? 'border-white bg-white text-black shadow-sm'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Warehouse Stock Status */}
            {inventory && (
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gothenburg Hub: In Stock ({inventory[selectedSize] ?? 'Ready'} units)
                </span>
                <span className="font-mono text-slate-500">Node.js API Synced</span>
              </div>
            )}
          </div>

          {/* Primary Action Button: "Add to Basket" */}
          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={handleAddClick}
              className={`w-full py-4 font-bold uppercase tracking-wider text-xs rounded-xl transition duration-150 cursor-pointer shadow-lg flex items-center justify-center gap-2 ${
                justAdded
                  ? 'bg-emerald-400 text-black'
                  : 'bg-white text-black hover:bg-slate-200'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Basket!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Basket &bull; {product.price}</span>
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

      {/* Technical Specifications */}
      <div className="space-y-4 border-t border-white/10 pt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Technical Specifications ({product.name})
          </h2>
          <span className="text-[11px] font-mono text-slate-500">
            DESIGNED IN GOTHENBURG
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Thermometer className="w-3.5 h-3.5 text-orange-400" />
              <span>Thermal Output</span>
            </div>
            <p className="font-bold text-white text-sm">{product.thermalOutput}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
              <span>Battery Runtime</span>
            </div>
            <p className="font-bold text-white text-sm">{product.batteryLife}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span>Waterproofing</span>
            </div>
            <p className="font-bold text-white text-sm">{product.waterproofing}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Shield className="w-3.5 h-3.5 text-slate-300" />
              <span>Outer Shell</span>
            </div>
            <p className="font-bold text-white text-sm">{product.outerShellMaterial}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Feather className="w-3.5 h-3.5 text-slate-300" />
              <span>Pair Weight</span>
            </div>
            <p className="font-bold text-white text-sm">{product.weight}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Manufacturer Warranty</span>
            </div>
            <p className="font-bold text-white text-sm">{product.warranty}</p>
          </div>
        </div>
      </div>

      {/* Interactive Thermal Elements & Temperature Visualizer */}
      <ThermalVisualizer maxTemp={selectedModel === 'adult' ? 45 : 40} />

    </div>
  );
};
