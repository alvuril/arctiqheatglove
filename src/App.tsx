/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CompanyInfo, ProductInfo, ActivePage, GloveModelType, GloveColourType, CartItem } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { CompanyHome } from './components/CompanyHome.tsx';
import { GloveCatalog } from './components/GloveCatalog.tsx';
import { GloveProduct } from './components/GloveProduct.tsx';
import { AccessoriesPage, AccessoryItemData, ARCTIQ_ACCESSORIES, PlugOption } from './components/AccessoriesPage.tsx';
import { AccessoryProduct } from './components/AccessoryProduct.tsx';
import { PurchasePage } from './components/PurchasePage.tsx';
import { OrdersPage } from './components/OrdersPage.tsx';
import { BasketDrawer } from './components/BasketDrawer.tsx';

import blackGlovePhoto from './assets/images/arctiq_glove_thinner_1793917309237.jpg';
import whiteGlovePhoto from './assets/images/arctiq_glove_white_1793974422249.jpg';
import kidsGlovePhoto from './assets/images/arctiq_glove_kids_1793974436351.jpg';

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

const ARCTIQ_PRODUCTS: {
  adult: ProductInfo;
  kids: ProductInfo;
} = {
  adult: {
    id: 'adult',
    name: 'Arctiq HeatGlove',
    modelType: 'adult',
    tagline: 'Extreme Nordic Sub-Zero Thermal Protection',
    price: '£159.99',
    numericPrice: 159.99,
    description:
      'The flagship Arctiq HeatGlove provides dependable, active warmth in damp freezing weather and sub-zero outdoor work. Constructed from high-quality technical materials with an internal PU waterproof membrane, it keeps moisture out while delivering up to 10 hours of continuous heating up to 45°C across the hand. Ergonomically balanced at 500–700g per pair and supported by a 2-year warranty.',
    colourway: 'Obsidian Black',
    colourways: [
      {
        id: 'black',
        name: 'Obsidian Black',
        hex: '#000000',
        image: blackGlovePhoto,
      },
      {
        id: 'white',
        name: 'Arctic White',
        hex: '#f8fafc',
        image: whiteGlovePhoto,
      },
    ],
    sizes: ['8.5', '9.5', '10.5', '11.5'],
    batteryLife: 'Up to 10 hours',
    thermalOutput: 'Max 45°C',
    waterproofing: 'PU-membrane',
    outerShellMaterial: 'High-Quality Materials',
    weight: '500–700g (pair)',
    warranty: '2 Years',
  },
  kids: {
    id: 'kids',
    name: 'Arctiq HeatGlove Kids',
    modelType: 'kids',
    tagline: 'Junior Winter Defense with Child-Safe Thermal Control',
    price: '£119.99',
    numericPrice: 119.99,
    description:
      'Engineered specifically for young adventurers, the Arctiq HeatGlove Kids edition delivers gentle, thermostatically regulated heating up to 40°C. Features a lightweight battery cell, reflective 3M safety piping for twilight visibility, and an impermeable PU barrier.',
    colourway: 'Obsidian Black',
    colourways: [
      {
        id: 'black',
        name: 'Obsidian Black',
        hex: '#000000',
        image: kidsGlovePhoto,
      },
      {
        id: 'white',
        name: 'Arctic White',
        hex: '#f8fafc',
        image: whiteGlovePhoto,
      },
    ],
    sizes: ['Youth S (6)', 'Youth M (7)', 'Youth L (8)'],
    batteryLife: 'Up to 10 hours',
    thermalOutput: 'Max 40°C (Junior Safe-Thermal Guard)',
    waterproofing: 'PU-membrane',
    outerShellMaterial: 'High-Quality Materials + 3M Reflective Piping',
    weight: '350–450g (pair)',
    warranty: '2 Years',
    safetyFeatures: 'Intelligent Overheat Throttling & 3M Reflective Piping',
  },
};

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedModel, setSelectedModel] = useState<GloveModelType>('adult');
  const [selectedColour, setSelectedColour] = useState<GloveColourType>('black');
  const [selectedSize, setSelectedSize] = useState<string>('9.5');
  const [selectedAccessoryId, setSelectedAccessoryId] = useState<string>('battery-pair');
  const [isBasketOpen, setIsBasketOpen] = useState<boolean>(false);

  // Cart state - initialized with the adult glove as default or empty
  const [cart, setCart] = useState<CartItem[]>([]);

  // Calculate total items count in basket
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Navigation from catalog to an individual glove product page
  const handleSelectGloveFromCatalog = (model: GloveModelType, colour: GloveColourType) => {
    setSelectedModel(model);
    setSelectedColour(colour);
    const prod = ARCTIQ_PRODUCTS[model];
    setSelectedSize(prod.sizes[1] || prod.sizes[0]);
    setActivePage('product-detail');
  };

  // Navigation to an individual accessory product page
  const handleSelectAccessory = (acc: AccessoryItemData) => {
    setSelectedAccessoryId(acc.id);
    setActivePage('accessory-detail');
  };

  // Add glove to cart with chosen size
  const handleAddGloveToBasket = (size: string) => {
    const product = ARCTIQ_PRODUCTS[selectedModel];
    const colourObj = product.colourways.find((c) => c.id === selectedColour) || product.colourways[0];
    const cartId = `glove-${selectedModel}-${selectedColour}-${size}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.id === cartId);
      if (existingIndex > -1) {
        return prevCart.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevCart,
        {
          id: cartId,
          itemType: 'glove',
          name: product.name,
          modelType: selectedModel,
          colourway: colourObj.name,
          size,
          price: product.price,
          numericPrice: product.numericPrice,
          image: colourObj.image,
          quantity: 1,
        },
      ];
    });

    setIsBasketOpen(true);
  };

  // Add accessory to cart with optional plug configuration
  const handleAddAccessoryToBasket = (acc: AccessoryItemData, plug?: PlugOption) => {
    const plugSuffix = plug ? `-${plug.id}` : '';
    const cartId = `accessory-${acc.id}${plugSuffix}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.id === cartId);
      if (existingIndex > -1) {
        return prevCart.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevCart,
        {
          id: cartId,
          itemType: 'accessory',
          name: acc.name,
          colourway: plug ? plug.name : undefined,
          price: acc.price,
          numericPrice: acc.numericPrice,
          image: plug ? plug.image : acc.image,
          quantity: 1,
        },
      ];
    });

    setIsBasketOpen(true);
  };

  // Modify quantity (+ / -) in cart
  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove item completely from cart
  const handleRemoveFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Ensure cart has at least the currently configured glove if user navigates to purchase with empty cart
  const effectiveCart: CartItem[] =
    cart.length > 0
      ? cart
      : [
          {
            id: `glove-${selectedModel}-${selectedColour}-${selectedSize}`,
            itemType: 'glove',
            name: ARCTIQ_PRODUCTS[selectedModel].name,
            modelType: selectedModel,
            colourway: selectedColour === 'black' ? 'Obsidian Black' : 'Arctic White',
            size: selectedSize,
            price: ARCTIQ_PRODUCTS[selectedModel].price,
            numericPrice: ARCTIQ_PRODUCTS[selectedModel].numericPrice,
            image:
              selectedModel === 'kids'
                ? kidsGlovePhoto
                : selectedColour === 'white'
                ? whiteGlovePhoto
                : blackGlovePhoto,
            quantity: 1,
          },
        ];

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-200 antialiased font-sans selection:bg-white selection:text-black flex flex-col justify-between">
      
      <div>
        {/* Navigation Bar with About Us, Product, Accessories, and Basket icon button */}
        <Navbar
          activePage={activePage}
          onNavigate={(page) => setActivePage(page)}
          cartCount={totalCartCount}
          onOpenBasket={() => setIsBasketOpen(true)}
        />

        {/* Slide-over Basket Drawer */}
        <BasketDrawer
          isOpen={isBasketOpen}
          onClose={() => setIsBasketOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveFromCart}
          onAddAccessory={handleAddAccessoryToBasket}
          onCheckout={() => {
            setIsBasketOpen(false);
            setActivePage('purchase');
          }}
          onNavigateToCatalog={() => {
            setIsBasketOpen(false);
            setActivePage('products');
          }}
        />

        {/* Active Page View */}
        <main>
          {activePage === 'home' && (
            <CompanyHome
              company={ARCTIQ_COMPANY}
              onNavigateToProduct={() => setActivePage('products')}
            />
          )}

          {activePage === 'products' && (
            <GloveCatalog
              onSelectGlove={handleSelectGloveFromCatalog}
              onDirectOrder={handleSelectGloveFromCatalog}
            />
          )}

          {activePage === 'product-detail' && (
            <GloveProduct
              products={ARCTIQ_PRODUCTS}
              selectedModel={selectedModel}
              selectedColour={selectedColour}
              selectedSize={selectedSize}
              onSizeChange={(s) => setSelectedSize(s)}
              onNavigateHome={() => setActivePage('home')}
              onNavigateToCatalog={() => setActivePage('products')}
              onAddToBasket={handleAddGloveToBasket}
            />
          )}

          {activePage === 'accessories' && (
            <AccessoriesPage
              onSelectAccessory={handleSelectAccessory}
              onAddAccessory={handleAddAccessoryToBasket}
              onNavigateToGloves={() => setActivePage('products')}
            />
          )}

          {activePage === 'accessory-detail' && (
            <AccessoryProduct
              accessory={
                ARCTIQ_ACCESSORIES.find((a) => a.id === selectedAccessoryId) || ARCTIQ_ACCESSORIES[0]
              }
              onNavigateBack={() => setActivePage('accessories')}
              onAddToBasket={handleAddAccessoryToBasket}
              onNavigateToCatalog={() => setActivePage('products')}
            />
          )}

          {activePage === 'purchase' && (
            <PurchasePage
              cart={effectiveCart}
              onNavigateBack={() => setActivePage('products')}
              onNavigateHome={() => setActivePage('home')}
              onNavigateToOrders={() => setActivePage('orders')}
              onOrderCompleted={() => setCart([])}
            />
          )}

          {activePage === 'orders' && (
            <OrdersPage
              onNavigateToCatalog={() => setActivePage('products')}
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
              onClick={() => setActivePage('home')}
              className={`hover:text-white transition-colors cursor-pointer ${
                activePage === 'home' ? 'text-white font-semibold' : ''
              }`}
            >
              About Us
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActivePage('products')}
              className={`hover:text-white transition-colors cursor-pointer ${
                activePage === 'products' || activePage === 'product-detail' ? 'text-white font-semibold' : ''
              }`}
            >
              Product
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActivePage('accessories')}
              className={`hover:text-white transition-colors cursor-pointer ${
                activePage === 'accessories' || activePage === 'accessory-detail' ? 'text-white font-semibold' : ''
              }`}
            >
              Accessories
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActivePage('orders')}
              className={`hover:text-white transition-colors cursor-pointer ${
                activePage === 'orders' ? 'text-white font-semibold' : ''
              }`}
            >
              Orders
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setIsBasketOpen(true)}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-slate-400"
            >
              <span>Basket</span>
              {totalCartCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-400 text-black font-bold text-[10px]">
                  {totalCartCount}
                </span>
              )}
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
