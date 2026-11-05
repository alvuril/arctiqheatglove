/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CompanyInfo, ProductInfo, ActivePage } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { CompanyHome } from './components/CompanyHome.tsx';
import { GloveProduct } from './components/GloveProduct.tsx';

const ARCTIQ_COMPANY: CompanyInfo = {
  name: 'Arctiq',
  slogan: 'Engineered for the elements.',
  about:
    'Founded in Gothenburg, Sweden, Arctiq develops high-performance thermal gear purpose-built for the realities of Scandinavian winter. Combining durable technical fabrics, impermeable weatherproofing, and battery-regulated heating elements, we build equipment that keeps hands functional and warm in sub-zero environments.',
  location: 'Gothenburg, Sweden',
  contactEmail: 'contact@arctiq.com',
  values: [
    {
      title: 'Northern Sweden Arctic Validation',
      description:
        'Engineered and tested against the sub-zero frost, biting blizzard winds, and extreme cold of Northern Sweden.',
    },
    {
      title: 'High-Quality Materials',
      description:
        'Constructed with high-quality technical materials and a breathable PU-membrane barrier that locks out wind, snow, and slush.',
    },
    {
      title: 'Controlled Thermal Endurance',
      description:
        'Calibrated micro-carbon heating delivering up to 10 hours of steady, regulated warmth up to 45°C directly to cold-sensitive extremities.',
    },
  ],
};

const ARCTIQ_PRODUCT: ProductInfo = {
  name: 'Arctiq HeatGlove',
  price: '£109.99',
  description:
    'The Arctiq HeatGlove provides dependable, active warmth in damp freezing weather and sub-zero outdoor work. Constructed from high-quality technical materials with an internal PU waterproof membrane, it keeps moisture out while delivering up to 10 hours of continuous heating up to 45°C across the hand. Ergonomically balanced at 500–700g per pair and supported by a 2-year warranty.',
  colourway: 'Black',
  sizes: ['8.5', '9.5', '10.5', '11.5'],
  batteryLife: 'Up to 10 hours',
  thermalOutput: 'Max 45°C',
  waterproofing: 'PU-membrane',
  outerShellMaterial: 'High-Quality Materials',
  weight: '500–700g (pair)',
  warranty: '2 Years',
};

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-200 antialiased font-sans selection:bg-white selection:text-black flex flex-col justify-between">
      
      <div>
        {/* Navigation Bar */}
        <Navbar
          activePage={activePage}
          onNavigate={(page) => setActivePage(page)}
        />

        {/* Active Page View */}
        <main>
          {activePage === 'home' ? (
            <CompanyHome
              company={ARCTIQ_COMPANY}
              onNavigateToProduct={() => setActivePage('product')}
            />
          ) : (
            <GloveProduct
              product={ARCTIQ_PRODUCT}
              onNavigateHome={() => setActivePage('home')}
            />
          )}
        </main>
      </div>

      {/* Clean Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/1ef8e445-18b7-4f5b-93fc-a7520d7a5b48_cbc409d4.png"
              alt="Arctiq"
              className="h-6 w-auto object-contain mix-blend-screen opacity-60"
            />
            <p>
              &copy; {new Date().getFullYear()} &bull; Engineered for the elements &bull; Gothenburg, Sweden
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setActivePage(activePage === 'home' ? 'product' : 'home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Go to {activePage === 'home' ? 'Product' : 'About Us'}
            </button>
            <span>&bull;</span>
            <a
              href="mailto:contact@arctiq.com"
              className="hover:text-white transition-colors font-mono"
            >
              contact@arctiq.com
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
