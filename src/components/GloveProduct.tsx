import React, { useState } from 'react';
import { ProductInfo } from '../types.ts';
import { GloveSvg } from './GloveSvg.tsx';
import { PurchaseModal } from './PurchaseModal.tsx';
import { ThermalVisualizer } from './ThermalVisualizer.tsx';
import { ArrowLeft, Check, ShieldCheck, Battery, Thermometer, Droplets, Feather, Shield } from 'lucide-react';
import darkGlovePhoto from '../assets/images/arctiq_glove_thinner_1793917309237.jpg';

interface GloveProductProps {
  product: ProductInfo;
  onNavigateHome: () => void;
}

export const GloveProduct: React.FC<GloveProductProps> = ({
  product,
  onNavigateHome,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('9.5');
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'photo' | 'outline'>('photo');
  const [inventory, setInventory] = useState<Record<string, number> | null>(null);

  React.useEffect(() => {
    fetch('/api/product')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data?.inventory) {
          setInventory(resData.data.inventory);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-12 py-10 px-6 max-w-5xl mx-auto">
      
      {/* Back button */}
      <button
        onClick={onNavigateHome}
        className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Arctiq Overview</span>
      </button>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        
        {/* Left: Product Visual Frame (Straight in front of camera & filled space) */}
        <div className="md:col-span-5 flex flex-col items-center justify-between p-5 sm:p-6 rounded-2xl bg-[#12151c] border border-white/10 min-h-[480px] sm:min-h-[520px] relative overflow-hidden group">
          
          {/* Top Indicators */}
          <div className="w-full flex items-center justify-between z-10 text-xs pb-2">
            <span className="px-2.5 py-1 bg-black/60 rounded-full text-[11px] text-slate-300 border border-white/10 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Direct Frontal View</span>
            </span>

            {/* View Switcher: Photo vs Outline */}
            <div className="flex bg-black/50 p-0.5 rounded-lg border border-white/10 text-[11px]">
              <button
                type="button"
                onClick={() => setViewMode('photo')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'photo'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Photo
              </button>
              <button
                type="button"
                onClick={() => setViewMode('outline')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'outline'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Outline
              </button>
            </div>
          </div>

          {/* Centered Image / Front-on SVG Outline - Spanning Available Space */}
          <div className="w-full flex-1 flex items-center justify-center py-2 my-auto">
            {viewMode === 'photo' ? (
              <div className="w-full h-full min-h-[380px] sm:min-h-[430px] flex items-center justify-center rounded-xl bg-[#12151c] p-1">
                <img
                  src={darkGlovePhoto}
                  alt="Arctiq HeatGlove Frontal View"
                  className="w-full h-auto max-h-[460px] max-w-[285px] sm:max-w-[310px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] hover:scale-102 transition-transform duration-500 rounded-lg mx-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-full h-full min-h-[380px] sm:min-h-[430px] flex items-center justify-center">
                <GloveSvg className="w-64 sm:w-72 h-auto" />
              </div>
            )}
          </div>
          
          {/* Bottom Caption */}
          <div className="w-full pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>COLOURWAY: OBSIDIAN BLACK</span>
            <span>HIGH-QUALITY MATERIALS</span>
          </div>
        </div>

        {/* Right: Product Details & Purchase Box */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Header */}
          <div className="space-y-1.5">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
              <span>Nordic Outdoor Series</span>
              <span aria-hidden="true" className="text-slate-600">&bull;</span>
              <span className="text-emerald-400">2-Year Warranty</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
              {product.name}
            </h1>
            
            <div className="pt-1 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white font-['Space_Grotesk']">
                {product.price}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Free UK & EU shipping included
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-300 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Colourway (Only Black) */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
              Colourway: <span className="text-white font-normal">{product.colourway}</span>
            </span>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/40 bg-white/10 text-xs font-semibold text-white">
              <span className="w-3.5 h-3.5 rounded-full bg-black border border-white/60" />
              <span>{product.colourway}</span>
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
              Select Size: <span className="text-white font-normal">{selectedSize}</span>
            </span>
            <div className="grid grid-cols-4 gap-2.5">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
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
                  Gothenburg Hub: In Stock ({inventory[selectedSize] ?? 'Available'} units)
                </span>
                <span className="font-mono text-slate-500">Node.js API Synced</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={() => setIsPurchaseModalOpen(true)}
              className="w-full py-4 bg-white text-black hover:bg-slate-200 font-bold uppercase tracking-wider text-xs rounded-xl transition duration-150 cursor-pointer shadow-lg"
            >
              Order {product.name} &bull; {product.price}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Includes 2-Year Warranty &bull; 30-Day Nordic Trial</span>
            </div>
          </div>

        </div>

      </div>

      {/* Technical Specifications */}
      <div className="space-y-4 border-t border-white/10 pt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Technical Specifications
          </h2>
          <span className="text-[11px] font-mono text-slate-500">
            DESIGNED IN GOTHENBURG
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          
          {/* Battery Life */}
          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Battery className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-semibold uppercase text-[10px]">Battery Life</span>
            </div>
            <p className="font-bold text-white text-sm">
              {product.batteryLife}
            </p>
          </div>

          {/* Thermal Output */}
          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Thermometer className="w-3.5 h-3.5 text-orange-400" />
              <span className="font-semibold uppercase text-[10px]">Thermal Output</span>
            </div>
            <p className="font-bold text-white text-sm">
              {product.thermalOutput}
            </p>
          </div>

          {/* Waterproofing */}
          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold uppercase text-[10px]">Waterproofing</span>
            </div>
            <p className="font-bold text-white text-sm">
              {product.waterproofing}
            </p>
          </div>

          {/* Outer Shell Material */}
          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold uppercase text-[10px]">Outer Shell Material</span>
            </div>
            <p className="font-bold text-white text-sm">
              {product.outerShellMaterial}
            </p>
          </div>

          {/* Weight */}
          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Feather className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-semibold uppercase text-[10px]">Pair Weight</span>
            </div>
            <p className="font-bold text-white text-sm">
              {product.weight}
            </p>
          </div>

          {/* Warranty */}
          <div className="p-4 rounded-xl bg-[#12151c] border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold uppercase text-[10px]">Warranty Policy</span>
            </div>
            <p className="font-bold text-white text-sm">
              {product.warranty}
            </p>
          </div>

        </div>
      </div>

      {/* Interactive Thermal Elements & Temperature Visualizer */}
      <ThermalVisualizer maxTemp={45} />

      {/* Purchase Screen Modal */}
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        product={product}
        selectedSize={selectedSize}
        onSizeChange={(sz) => setSelectedSize(sz)}
      />

    </div>
  );
};
