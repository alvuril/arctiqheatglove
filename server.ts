import express, { Request, Response } from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Product specifications matching user constraints
const ARCTIQ_PRODUCTS_DATA = {
  adult: {
    id: 'adult',
    name: 'Arctiq HeatGlove',
    modelType: 'adult',
    tagline: 'Engineered for extreme sub-zero conditions',
    price: '£159.99',
    numericPrice: 159.99,
    currency: 'GBP',
    colourways: ['Obsidian Black', 'Arctic White'],
    sizes: ['8.5', '9.5', '10.5', '11.5'],
    batteryLife: 'Up to 10 hours',
    thermalOutput: 'Max 45°C',
    waterproofing: 'PU-membrane',
    outerShellMaterial: 'High-Quality Materials',
    weight: '500–700g (pair)',
    warranty: '2 Years',
    description:
      'The Arctiq HeatGlove provides dependable, active warmth in damp freezing weather and sub-zero outdoor work. Constructed from high-quality technical materials with an internal PU waterproof membrane, it keeps moisture out while delivering up to 10 hours of continuous heating up to 45°C across the hand. Ergonomically balanced at 500–700g per pair and supported by a 2-year warranty.',
    inventory: {
      '8.5': 28,
      '9.5': 64,
      '10.5': 52,
      '11.5': 21,
    } as Record<string, number>,
  },
  kids: {
    id: 'kids',
    name: 'Arctiq HeatGlove Kids',
    modelType: 'kids',
    tagline: 'Junior thermal defense with safe heat regulation',
    price: '£119.99',
    numericPrice: 119.99,
    currency: 'GBP',
    colourways: ['Obsidian Black', 'Arctic White'],
    sizes: ['Youth S (6)', 'Youth M (7)', 'Youth L (8)'],
    batteryLife: 'Up to 10 hours',
    thermalOutput: 'Max 40°C (Junior Safe-Thermal Guard)',
    waterproofing: 'PU-membrane',
    outerShellMaterial: 'High-Quality Materials + 3M Reflective Piping',
    weight: '350–450g (pair)',
    warranty: '2 Years',
    description:
      'Engineered specifically for young adventurers, the Arctiq HeatGlove Kids edition delivers gentle, thermostatically regulated heating up to 40°C. Features a lightweight battery cell, reflective safety accents for twilight visibility, and an impermeable PU barrier.',
    inventory: {
      'Youth S (6)': 35,
      'Youth M (7)': 48,
      'Youth L (8)': 30,
    } as Record<string, number>,
  },
};

// Company details
const ARCTIQ_COMPANY_DATA = {
  name: 'Arctiq',
  slogan: 'Engineered for the elements.',
  location: 'Gothenburg, Sweden',
  contactEmail: 'contact@arctiq.com',
  about:
    'Founded in Gothenburg, Sweden, Arctiq develops high-performance thermal gear purpose-built for the realities of Scandinavian winter. Combining durable technical fabrics, impermeable weatherproofing, and battery-regulated heating elements, we build equipment that keeps hands functional and warm in sub-zero environments.',
  testingLocation: 'Northern Sweden Arctic Proving Grounds',
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

// In-memory store for orders and inquiries
interface OrderLineItem {
  id: string;
  name: string;
  colourway?: string;
  size?: string;
  price: string;
  quantity: number;
}

interface OrderRecord {
  orderRef: string;
  item: string;
  items?: OrderLineItem[];
  colourway: string;
  size: string;
  price: string;
  customerName: string;
  email: string;
  address: string;
  city: string;
  postal: string;
  country: string;
  paymentMethod: string;
  warehouse: string;
  status: 'confirmed' | 'processing' | 'dispatched';
  createdAt: string;
}

const ordersDatabase: Map<string, OrderRecord> = new Map();
const contactInquiries: Array<{ id: string; name: string; email: string; message: string; date: string }> = [];

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      server: 'Arctiq Node.js / Express Backend',
      environment: process.env.NODE_ENV || 'development',
      location: 'Gothenburg, Sweden',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // Company Information
  app.get('/api/company', (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: ARCTIQ_COMPANY_DATA,
    });
  });

  // Product Information & Live Inventory (Supports ?model=adult or ?model=kids, defaults to all)
  app.get('/api/product', (req: Request, res: Response) => {
    const model = (req.query.model as string) || 'adult';
    const selected = (ARCTIQ_PRODUCTS_DATA as any)[model] || ARCTIQ_PRODUCTS_DATA.adult;
    res.json({
      success: true,
      data: selected,
      products: ARCTIQ_PRODUCTS_DATA,
    });
  });

  // Thermal Simulation Calculation
  app.post('/api/telemetry/simulate', (req: Request, res: Response) => {
    const { targetTemp = 35 } = req.body;
    const clampedTemp = Math.max(20, Math.min(45, Number(targetTemp) || 35));

    // Dynamic battery formula: 20°C -> 10.0 hrs, 45°C -> 4.0 hrs
    const ratio = (clampedTemp - 20) / (45 - 20);
    const batteryLifeHours = Number((10.0 - ratio * 6.0).toFixed(1));
    const powerDrawWatts = Number((1.8 + ratio * 5.4).toFixed(1));
    const estimatedMinutes = Math.round(batteryLifeHours * 60);

    let mode = 'Optimal';
    if (clampedTemp <= 28) mode = 'Eco Mode';
    else if (clampedTemp >= 40) mode = 'Sub-Zero Max Boost';

    res.json({
      success: true,
      telemetry: {
        targetTemp: clampedTemp,
        maxTemp: 45,
        batteryLifeHours,
        estimatedMinutes,
        powerDrawWatts,
        mode,
        rampUpSeconds: Math.round(10 + ratio * 15),
        activeZones: [
          'Thumb Micro-Carbon Filament',
          'Index / Trigger Trace',
          'Middle, Ring & Pinky Radiant Grid',
          'Palm Conductive Mesh',
        ],
        ambientOperatingLimit: '-30°C',
      },
    });
  });

  // Order Placement (Supports both full cart items array and single item payloads)
  app.post('/api/orders', (req: Request, res: Response) => {
    const {
      items,
      model = 'adult',
      colourway = 'Obsidian Black',
      size,
      name,
      email,
      address,
      city,
      postal,
      country,
      paymentMethod,
      itemType,
      itemTitle,
      itemPrice,
    } = req.body;

    if (!name || !email || !address || !city || !postal || !country) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required shipping details.',
      });
    }

    const orderRef = `ARCTIQ-${Math.floor(100000 + Math.random() * 900000)}`;

    if (Array.isArray(items) && items.length > 0) {
      // Cart items checkout
      let computedTotal = 0;
      const orderLines: OrderLineItem[] = [];

      for (const cartItm of items) {
        const qty = Number(cartItm.quantity) || 1;
        const linePrice = Number(cartItm.numericPrice) || 0;
        computedTotal += linePrice * qty;

        // Deduct inventory if it's a glove
        if (cartItm.itemType === 'glove' && cartItm.modelType && cartItm.size) {
          const rec = (ARCTIQ_PRODUCTS_DATA as any)[cartItm.modelType];
          if (rec?.inventory?.[cartItm.size] && rec.inventory[cartItm.size] >= qty) {
            rec.inventory[cartItm.size] -= qty;
          }
        }

        orderLines.push({
          id: cartItm.id,
          name: cartItm.name,
          colourway: cartItm.colourway || 'Standard',
          size: cartItm.size || 'Universal',
          price: cartItm.price || `£${linePrice.toFixed(2)}`,
          quantity: qty,
        });
      }

      const totalFormatted = `£${computedTotal.toFixed(2)}`;
      const summaryTitle = orderLines.length === 1 ? orderLines[0].name : `${orderLines[0].name} + ${orderLines.length - 1} more`;

      const newOrder: OrderRecord = {
        orderRef,
        item: summaryTitle,
        items: orderLines,
        colourway: orderLines[0].colourway || 'Standard',
        size: orderLines[0].size || 'Standard',
        price: totalFormatted,
        customerName: name,
        email,
        address,
        city,
        postal,
        country,
        paymentMethod: paymentMethod || 'card',
        warehouse: 'Gothenburg Logistics Terminal, Sweden',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      ordersDatabase.set(orderRef, newOrder);

      return res.status(201).json({
        success: true,
        orderRef,
        order: newOrder,
      });
    }

    // Single item fallback
    const isAccessory = itemType === 'accessory';
    const productRecord = (ARCTIQ_PRODUCTS_DATA as any)[model] || ARCTIQ_PRODUCTS_DATA.adult;

    if (!isAccessory && (!size || !productRecord.sizes.includes(size))) {
      return res.status(400).json({
        success: false,
        error: `Invalid size for ${productRecord.name}. Available sizes: ${productRecord.sizes.join(', ')}.`,
      });
    }

    if (!isAccessory && productRecord.inventory[size] > 0) {
      productRecord.inventory[size] -= 1;
    }

    const newOrder: OrderRecord = {
      orderRef,
      item: isAccessory ? (itemTitle || 'Arctiq Accessory') : productRecord.name,
      items: [
        {
          id: isAccessory ? 'acc-1' : `${model}-${colourway}-${size}`,
          name: isAccessory ? (itemTitle || 'Arctiq Accessory') : productRecord.name,
          colourway: isAccessory ? 'Standard' : (colourway || 'Obsidian Black'),
          size: isAccessory ? 'One Size / Universal' : size,
          price: isAccessory ? (itemPrice || '£19.99') : productRecord.price,
          quantity: 1,
        },
      ],
      colourway: isAccessory ? 'Standard' : (colourway || 'Obsidian Black'),
      size: isAccessory ? 'One Size / Universal' : size,
      price: isAccessory ? (itemPrice || '£19.99') : productRecord.price,
      customerName: name,
      email,
      address,
      city,
      postal,
      country,
      paymentMethod: paymentMethod || 'card',
      warehouse: 'Gothenburg Logistics Terminal, Sweden',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    ordersDatabase.set(orderRef, newOrder);

    return res.status(201).json({
      success: true,
      orderRef,
      order: newOrder,
    });
  });

  // Order Lookup
  app.get('/api/orders/:orderRef', (req: Request, res: Response) => {
    const { orderRef } = req.params;
    const order = ordersDatabase.get(orderRef.toUpperCase());

    if (!order) {
      return res.status(404).json({
        success: false,
        error: `Order with reference ${orderRef} was not found.`,
      });
    }

    return res.json({
      success: true,
      order,
    });
  });

  // Contact Inquiries
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required.',
      });
    }

    const inquiry = {
      id: `INQ-${Date.now()}`,
      name,
      email,
      message,
      date: new Date().toISOString(),
    };

    contactInquiries.push(inquiry);

    return res.json({
      success: true,
      message: 'Thank you for reaching out. Arctiq customer support in Gothenburg will review your inquiry.',
      inquiryId: inquiry.id,
      routedTo: ARCTIQ_COMPANY_DATA.contactEmail,
    });
  });

  const httpServer = http.createServer(app);

  // --- VITE DEV OR STATIC PRODUCTION SERVING ---
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Arctiq Node.js server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
