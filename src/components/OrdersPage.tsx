import React, { useState, useEffect } from 'react';
import { CustomerOrder } from '../types.ts';
import { getStoredOrders, clearStoredOrders } from '../utils/orderStorage.ts';
import {
  Package,
  Truck,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Search,
  HardDrive,
  Trash2,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

interface OrdersPageProps {
  onNavigateToCatalog: () => void;
  onNavigateHome: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  onNavigateToCatalog,
  onNavigateHome,
}) => {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [searchRef, setSearchRef] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  useEffect(() => {
    // Load orders saved on this computer
    const saved = getStoredOrders();
    setOrders(saved);
  }, []);

  const handleCopyRef = (ref: string) => {
    navigator.clipboard?.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRef.trim()) return;

    setSearchError(null);
    const cleanRef = searchRef.trim().toUpperCase();

    // Check if already in local state
    const existing = orders.find((o) => o.orderRef.toUpperCase() === cleanRef);
    if (existing) {
      setSearchError(null);
      return;
    }

    try {
      const res = await fetch(`/api/orders/${cleanRef}`);
      const data = await res.json();
      if (res.ok && data.success && data.order) {
        // Construct order view
        const fetchedOrder: CustomerOrder = {
          orderRef: data.order.orderRef,
          createdAt: data.order.createdAt || new Date().toISOString(),
          estimatedDeliveryDate: '3–5 Business Days',
          deliveryDaysEstimate: 'Express Delivery from Gothenburg Hub',
          status: 'Preparing at Gothenburg Terminal',
          customerName: data.order.customerName,
          email: data.order.email,
          address: data.order.address,
          city: data.order.city,
          postal: data.order.postal,
          country: data.order.country,
          paymentMethod: data.order.paymentMethod,
          items: data.order.items || [
            {
              id: 'item-1',
              name: data.order.item,
              colourway: data.order.colourway,
              size: data.order.size,
              price: data.order.price,
              quantity: 1,
            },
          ],
          totalPrice: data.order.price,
          trackingCarrier: 'PostNord / DHL Express',
          trackingCode: `SE-${Math.floor(10000000 + Math.random() * 90000000)}`,
        };
        setOrders((prev) => [fetchedOrder, ...prev]);
        setSearchRef('');
      } else {
        setSearchError(`No order record found for "${cleanRef}". Please verify the reference.`);
      }
    } catch {
      setSearchError('Could not connect to verify order reference.');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear your private order history stored on this computer?')) {
      clearStoredOrders();
      setOrders([]);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300 mb-2">
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privately Stored on Your Device</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
              My Orders &amp; Delivery Tracking
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Track your Arctiq heated gear dispatches and estimated delivery arrivals. All order records remain saved privately in your computer's browser storage so you can review them whenever you return.
            </p>
          </div>

          {orders.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition cursor-pointer p-2 rounded-xl hover:bg-white/5"
              title="Clear private order history from this computer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Order Reference Lookup Box */}
        <form onSubmit={handleLookup} className="flex gap-2 max-w-md pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Look up order ref (e.g. ARCTIQ-123456)"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#12151c] border border-white/15 text-xs text-white placeholder-slate-500 outline-none focus:border-white transition font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shrink-0"
          >
            Find
          </button>
        </form>

        {searchError && (
          <p className="text-xs text-rose-400 pt-1 font-medium">{searchError}</p>
        )}
      </div>

      {/* Main Content */}
      {orders.length === 0 ? (
        /* Empty State */
        <div className="p-10 sm:p-16 rounded-3xl bg-[#12151c] border border-white/10 text-center space-y-5 max-w-2xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">
              No Orders Saved on This Device Yet
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              When you order an Arctiq HeatGlove or accessory, your receipt, arrival schedule, and tracking reference will be saved right here in your computer's browser storage.
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={onNavigateToCatalog}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition cursor-pointer shadow-lg"
            >
              <span>Explore Heated Gloves</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* List of Saved Orders */
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.orderRef}
              className="rounded-3xl bg-[#12151c] border border-white/15 overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8"
            >
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      Order Reference:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyRef(order.orderRef)}
                      className="inline-flex items-center gap-1.5 font-mono font-bold text-sm text-white hover:text-emerald-400 transition cursor-pointer group"
                      title="Copy order reference"
                    >
                      <span>{order.orderRef}</span>
                      {copiedRef === order.orderRef ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                      )}
                    </button>
                  </div>
                  <div className="text-xs text-slate-400">
                    Placed on {formatDate(order.createdAt)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{order.status}</span>
                  </span>
                  <span className="font-['Space_Grotesk'] font-extrabold text-xl text-white">
                    {order.totalPrice}
                  </span>
                </div>
              </div>

              {/* ESTIMATED DELIVERY ARRIVAL BOX ("When it would come") */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#18202e] to-[#12151c] border border-emerald-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-400 text-black flex items-center justify-center shrink-0 shadow-md">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                        Estimated Delivery Arrival
                      </span>
                      <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white">
                        {order.estimatedDeliveryDate}
                      </h3>
                      <p className="text-xs text-slate-300">
                        {order.deliveryDaysEstimate} &bull; Shipped from Gothenburg Logistics Hub
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs space-y-0.5">
                    <span className="text-slate-400 text-[11px] block">Carrier Tracking:</span>
                    <span className="font-mono text-emerald-300 font-bold block">
                      {order.trackingCode}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {order.trackingCarrier}
                    </span>
                  </div>
                </div>

                {/* Progress Tracking Stepper */}
                <div className="pt-3 border-t border-white/10">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {/* Step 1 */}
                    <div className="space-y-1.5">
                      <div className="h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[10px] font-semibold text-emerald-400 block">
                        1. Confirmed
                      </span>
                    </div>
                    {/* Step 2 */}
                    <div className="space-y-1.5">
                      <div className="h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-semibold text-white block">
                        2. Packing Hub
                      </span>
                    </div>
                    {/* Step 3 */}
                    <div className="space-y-1.5">
                      <div className="h-1.5 rounded-full bg-white/15" />
                      <span className="text-[10px] font-medium text-slate-500 block">
                        3. In Transit
                      </span>
                    </div>
                    {/* Step 4 */}
                    <div className="space-y-1.5">
                      <div className="h-1.5 rounded-full bg-white/15" />
                      <span className="text-[10px] font-medium text-slate-500 block">
                        4. Delivered
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ordered Items List */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                  Items in this Order ({order.items.reduce((s, i) => s + i.quantity, 0)} total)
                </span>

                <div className="space-y-2.5">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#0e1117] border border-white/10 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {item.image && (
                          <div className="w-14 h-16 rounded-xl bg-[#08090d] border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <div className="min-w-0 space-y-0.5">
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
                            <span className="text-slate-500 font-medium">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-white text-sm">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Destination & Payment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
                <div className="p-4 rounded-2xl bg-[#0e1117] border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>Delivery Address</span>
                  </div>
                  <p className="text-white font-medium">{order.customerName}</p>
                  <p className="text-slate-300">
                    {order.address}, {order.city}, {order.postal}, {order.country}
                  </p>
                  <p className="text-slate-500 font-mono text-[11px]">{order.email}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e1117] border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Payment Information</span>
                  </div>
                  <p className="text-white font-medium uppercase">
                    Authorized via {order.paymentMethod}
                  </p>
                  <p className="text-slate-400">
                    256-Bit SSL Encrypted &bull; VAT &amp; Import Duties Included
                  </p>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold pt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Backed by 2-Year Arctiq Nordic Warranty</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
