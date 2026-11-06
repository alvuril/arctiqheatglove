import React from 'react';
import { CartItem } from '../types.ts';
import { ARCTIQ_ACCESSORIES, AccessoryItemData } from './AccessoriesPage.tsx';
import { X, ShoppingBag, Plus, Minus, Trash2, Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface BasketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onAddAccessory: (accessory: AccessoryItemData) => void;
  onCheckout: () => void;
  onNavigateToCatalog: () => void;
}

export const BasketDrawer: React.FC<BasketDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onAddAccessory,
  onCheckout,
  onNavigateToCatalog,
}) => {
  if (!isOpen) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.numericPrice * item.quantity, 0);

  // Dynamic accessory recommendation with contextual reason
  const hasBattery = cart.some((item) => item.id.includes('battery') || item.name.includes('Battery'));
  const hasCharger = cart.some((item) => item.id.includes('charger') || item.name.includes('Charger'));
  const hasCase = cart.some((item) => item.id.includes('case') || item.name.includes('Case'));

  let recommendedAccessory: AccessoryItemData;
  let recommendationReason: string;

  if (!hasBattery) {
    recommendedAccessory = ARCTIQ_ACCESSORIES[0]; // Dual Battery Pack
    recommendationReason =
      'Sub-zero arctic temperatures accelerate lithium drain. An extra pair guarantees continuous 20-hour expedition warmth so you can swap batteries on the lift.';
  } else if (!hasCharger) {
    recommendedAccessory = ARCTIQ_ACCESSORIES[1]; // Fast Charger
    recommendationReason =
      'Rapidly recharges both glove battery packs simultaneously in just 1.8 hours before early morning alpine tours.';
  } else if (!hasCase) {
    recommendedAccessory = ARCTIQ_ACCESSORIES[2]; // Protective Case
    recommendationReason =
      'Custom shockproof EVA shell shields delicate internal carbon heating elements and battery connectors from heavy ski luggage compression.';
  } else {
    recommendedAccessory = ARCTIQ_ACCESSORIES[3]; // Storm Leashes
    recommendationReason =
      'Elastic wrist retention cords with 3M reflective safety weave keep your gloves tethered so you never drop them off chairlifts.';
  }

  const isRecommendedInCart = cart.some((item) => item.name === recommendedAccessory.name);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-[#0e1117] border-l border-white/10 text-slate-200 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#12151c]/90">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                  Your Basket
                </h2>
                <p className="text-xs text-slate-400">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} &bull; Express delivery from Gothenburg
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Close basket"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-['Space_Grotesk'] text-base font-bold text-white">
                    Your basket is empty
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Explore our heated gloves and modular accessories designed for severe Scandinavian winter.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToCatalog();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition cursor-pointer"
                >
                  <span>Browse HeatGloves</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                {/* List of Cart Items */}
                <div className="space-y-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Selected Items
                  </span>

                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-[#141822] border border-white/10 flex gap-3.5 items-center group transition hover:border-white/20"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-16 h-20 rounded-xl bg-[#0a0c10] border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-['Space_Grotesk'] font-bold text-sm text-white truncate">
                          {item.name}
                        </h4>

                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                          {item.colourway && (
                            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                              {item.colourway}
                            </span>
                          )}
                          {item.size && (
                            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-emerald-400 font-bold">
                              Size {item.size}
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-bold text-white pt-0.5">
                          {item.price}
                        </div>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center border border-white/15 rounded-lg bg-[#0a0c10] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="px-2 py-1 text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer text-xs"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-mono font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="px-2 py-1 text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer text-xs"
                            title="Add more"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ACCESSORY RECOMMENDATION WITH SMALL REASON WHY */}
                {!isRecommendedInCart && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-[#181d28] to-[#12151c] border border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="uppercase tracking-wider text-[10px]">
                          Recommended Companion
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        Alpine Essential
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="w-14 h-16 rounded-xl bg-[#0a0c10] border border-white/10 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={recommendedAccessory.image}
                          alt={recommendedAccessory.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h5 className="font-['Space_Grotesk'] font-bold text-xs text-white">
                          {recommendedAccessory.name}
                        </h5>
                        <div className="text-xs font-bold text-amber-300">
                          {recommendedAccessory.price}
                        </div>
                      </div>
                    </div>

                    {/* The small reason why */}
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-300 leading-relaxed">
                      <strong className="text-white font-medium block mb-0.5">
                        Why we recommend this:
                      </strong>
                      {recommendationReason}
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddAccessory(recommendedAccessory)}
                      className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Basket &bull; {recommendedAccessory.price}</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Summary & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-white/10 bg-[#12151c] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono font-medium text-white">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Express Nordic Delivery:</span>
                  <span className="text-emerald-400 font-semibold uppercase">Free</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-white/10 text-sm font-bold text-white">
                  <span>Total Amount:</span>
                  <span className="font-['Space_Grotesk'] text-xl font-extrabold text-white">
                    £{subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full py-4 bg-white text-black hover:bg-slate-200 font-bold uppercase tracking-wider text-xs rounded-xl shadow-xl transition duration-150 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout &bull; £{subtotal.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>2-Year Warranty &bull; Free Returns &bull; Dispatched from Gothenburg</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
