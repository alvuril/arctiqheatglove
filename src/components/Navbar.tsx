import React from 'react';
import { ActivePage } from '../types.ts';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0c10]/95 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
        
        {/* Brand Lockup with Attached Arctiq Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left group cursor-pointer flex items-center gap-3"
          aria-label="Arctiq Home"
        >
          <img
            src="/assets/aistudio/1ef8e445-18b7-4f5b-93fc-a7520d7a5b48_cbc409d4.png"
            alt="Arctiq Logo"
            className="h-9 sm:h-10 w-auto object-contain mix-blend-screen group-hover:scale-102 transition-transform"
          />
          <div className="hidden sm:block border-l border-white/15 pl-3">
            <span className="text-[10px] text-slate-400 font-normal tracking-wider block">
              Gothenburg &bull; Sweden
            </span>
          </div>
        </button>

        {/* Page Switcher */}
        <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => onNavigate('home')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activePage === 'home'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            About Us
          </button>

          <button
            onClick={() => onNavigate('product')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activePage === 'product'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Product
          </button>
        </nav>

        {/* Quick Order Affordance */}
        <button
          onClick={() => onNavigate('product')}
          className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wider uppercase text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg transition cursor-pointer"
        >
          View HeatGlove &bull; £109.99
        </button>

      </div>
    </header>
  );
};
