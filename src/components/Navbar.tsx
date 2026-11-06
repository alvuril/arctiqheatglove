import React from 'react';
import { ActivePage } from '../types.ts';
import { ShoppingBag } from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  cartCount: number;
  onOpenBasket: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  cartCount,
  onOpenBasket,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0c10]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Lockup with Attached Arctiq Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left group cursor-pointer flex items-center gap-3 shrink-0"
          aria-label="Arctiq Home"
        >
          <img
            src="/assets/aistudio/1ef8e445-18b7-4f5b-93fc-a7520d7a5b48_cbc409d4.png"
            alt="Arctiq Logo"
            className="h-8 sm:h-9 w-auto object-contain mix-blend-screen group-hover:scale-102 transition-transform"
          />
          <div className="hidden md:block border-l border-white/15 pl-3">
            <span className="text-[10px] text-slate-400 font-normal tracking-wider block">
              Gothenburg &bull; Sweden
            </span>
          </div>
        </button>

        {/* Page Switcher: About Us, Product, Accessories */}
        <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activePage === 'home'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            About Us
          </button>

          <button
            onClick={() => onNavigate('products')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activePage === 'products' || activePage === 'product-detail'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Product
          </button>

          <button
            onClick={() => onNavigate('accessories')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activePage === 'accessories' || activePage === 'accessory-detail'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Accessories
          </button>

          <button
            onClick={() => onNavigate('orders')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activePage === 'orders'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Orders
          </button>
        </nav>

        {/* Top-Right Basket Icon Button with Item Count Badge */}
        <button
          type="button"
          onClick={onOpenBasket}
          className="relative inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition cursor-pointer group shadow-sm shrink-0"
          aria-label={`Open Basket (${cartCount} items)`}
        >
          <ShoppingBag className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline text-xs font-bold tracking-wider uppercase">
            Basket
          </span>

          {cartCount > 0 ? (
            <span className="w-5 h-5 rounded-full bg-emerald-400 text-black font-bold text-[11px] flex items-center justify-center font-mono">
              {cartCount}
            </span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-slate-500" />
          )}
        </button>

      </div>
    </header>
  );
};
