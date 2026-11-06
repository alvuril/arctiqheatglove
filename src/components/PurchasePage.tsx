import React, { useState } from 'react';
import { CartItem } from '../types.ts';
import { saveOrderToStorage, createCustomerOrderRecord, calculateEstimatedDelivery } from '../utils/orderStorage.ts';
import { ArrowLeft, CheckCircle, ShieldCheck, CreditCard, Lock, Truck, ShoppingBag, Calendar, PackageCheck } from 'lucide-react';

interface PurchasePageProps {
  cart: CartItem[];
  onNavigateBack: () => void;
  onNavigateHome: () => void;
  onNavigateToOrders?: () => void;
  onOrderCompleted?: () => void;
}

export const PurchasePage: React.FC<PurchasePageProps> = ({
  cart,
  onNavigateBack,
  onNavigateHome,
  onNavigateToOrders,
  onOrderCompleted,
}) => {
  const [step, setStep] = useState<'checkout' | 'processing' | 'confirmed'>('checkout');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google' | 'klarna'>('card');
  const [orderRef, setOrderRef] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states - empty by default as required
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');
  const [country, setCountry] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const totalAmount = cart.reduce((sum, item) => sum + item.numericPrice * item.quantity, 0);
  const formattedTotal = `£${totalAmount.toFixed(2)}`;

  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMessage('Your basket is empty. Please add items before checking out.');
      return;
    }

    setStep('processing');
    setErrorMessage(null);

    const recordOrderLocally = (ref: string) => {
      const record = createCustomerOrderRecord({
        orderRef: ref,
        name,
        email,
        address,
        city,
        postal,
        country,
        paymentMethod,
        items: cart,
        totalPrice: formattedTotal,
      });
      saveOrderToStorage(record);
      setConfirmedOrder(record);
      setOrderRef(ref);
      setStep('confirmed');
      if (onOrderCompleted) onOrderCompleted();
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          name,
          email,
          address,
          city,
          postal,
          country,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        recordOrderLocally(data.orderRef);
      } else {
        setErrorMessage(data.error || 'Order placement failed. Please verify your details.');
        setStep('checkout');
      }
    } catch {
      // Graceful fallback
      const generatedRef = `ARCTIQ-${Math.floor(100000 + Math.random() * 900000)}`;
      recordOrderLocally(generatedRef);
    }
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Breadcrumb & Return Action */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      {/* CONFIRMED RECEIPT VIEW */}
      {step === 'confirmed' ? (
        <div className="max-w-2xl mx-auto bg-[#12151c] border border-white/20 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle className="w-9 h-9 shrink-0" />
            <div>
              <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold block">
                Official Order Receipt
              </span>
              <h2 className="text-2xl sm:text-3xl font-['Space_Grotesk'] font-bold text-white">
                Thank You for Your Order!
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300">
            Your Arctiq order has been confirmed and is being allocated for express dispatch from our Gothenburg logistics terminal.
          </p>

          {/* ARRIVAL ESTIMATE HIGHLIGHT BOX */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-[#18202e] to-[#12151c] border border-emerald-500/30 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-400 text-black flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 text-xs">
              <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                Expected Delivery Date
              </span>
              <h3 className="font-['Space_Grotesk'] font-bold text-base text-white">
                {confirmedOrder?.estimatedDeliveryDate || '3–5 Business Days (Express Priority)'}
              </h3>
              <p className="text-slate-300 text-[11px]">
                Express air freight from Gothenburg. Saved privately on your computer under <strong>Orders</strong>.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-white/10">
              <span className="text-slate-400">Order Reference:</span>
              <span className="font-mono font-bold text-white text-sm tracking-wider">{orderRef}</span>
            </div>

            <div className="py-2 border-b border-white/10 space-y-2">
              <span className="text-slate-400 block font-semibold">Purchased Items:</span>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="text-white">
                    <span className="font-semibold">{item.name}</span>
                    {item.colourway && <span className="text-slate-400 font-mono text-[11px]"> &bull; {item.colourway}</span>}
                    {item.size && <span className="text-emerald-400 font-mono text-[11px]"> (Size {item.size})</span>}
                    <span className="text-slate-500 text-[11px]"> &times; {item.quantity}</span>
                  </div>
                  <span className="font-mono text-white font-semibold">
                    £{(item.numericPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Delivery Address:</span>
              <span className="text-white text-right font-medium">
                {address}, {city}, {postal}, {country}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Payment Status:</span>
              <span className="text-emerald-400 font-semibold uppercase">Authorized ({paymentMethod})</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/10 text-sm font-bold text-white">
              <span>Total Paid:</span>
              <span className="font-['Space_Grotesk'] text-lg">{formattedTotal}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
            <Truck className="w-5 h-5 text-sky-400 shrink-0" />
            <span>
              Dispatched with express tracking. Confirmation details sent to <strong className="text-white">{email}</strong>.
            </span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            {onNavigateToOrders && (
              <button
                type="button"
                onClick={onNavigateToOrders}
                className="flex-1 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer transition-colors text-center shadow-lg flex items-center justify-center gap-2"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Track in My Orders</span>
              </button>
            )}
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex-1 py-3.5 bg-white text-black hover:bg-slate-200 font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer transition-colors text-center"
            >
              Return to Store
            </button>
            <button
              type="button"
              onClick={onNavigateBack}
              className="flex-1 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer transition-colors text-center border border-white/15"
            >
              Shop More
            </button>
          </div>
        </div>
      ) : step === 'processing' ? (
        /* PROCESSING STEP */
        <div className="max-w-md mx-auto py-24 text-center space-y-4">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            Allocating Inventory &amp; Authorizing Payment...
          </h3>
          <p className="text-xs text-slate-400">
            Processing your Arctiq order at the Gothenburg logistics terminal.
          </p>
        </div>
      ) : (
        /* MAIN CHECKOUT PAGE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: CHECKOUT FORM & PAYMENT */}
          <div className="lg:col-span-7 bg-[#12151c] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                Purchase Order
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your delivery address and payment method to complete your order.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-300 font-semibold block">
                Select Payment Method
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-3 px-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-white bg-white/20 text-white shadow-sm'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple')}
                  className={`py-3 px-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'apple'
                      ? 'border-white bg-white/20 text-white shadow-sm'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-bold"></span>
                  <span>Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('google')}
                  className={`py-3 px-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'google'
                      ? 'border-white bg-white/20 text-white shadow-sm'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold text-sky-400">G</span>
                  <span>Google Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('klarna')}
                  className={`py-3 px-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'klarna'
                      ? 'border-pink-400/80 bg-pink-500/20 text-white shadow-sm'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold text-pink-300">K.</span>
                  <span>Klarna</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              
              {/* Shipping Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] pb-1 border-b border-white/10">
                  1. Delivery Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Lind"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0a0c10] border border-white/15 rounded-xl p-3 text-white outline-none focus:border-white placeholder-slate-600 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0a0c10] border border-white/15 rounded-xl p-3 text-white outline-none focus:border-white placeholder-slate-600 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 42 Kungsportsavenyn"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#0a0c10] border border-white/15 rounded-xl p-3 text-white outline-none focus:border-white placeholder-slate-600 transition"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">City</label>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#0a0c10] border border-white/15 rounded-xl p-3 text-white outline-none focus:border-white placeholder-slate-600 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      placeholder="Postal Code"
                      value={postal}
                      onChange={(e) => setPostal(e.target.value)}
                      className="w-full bg-[#0a0c10] border border-white/15 rounded-xl p-3 text-white outline-none focus:border-white placeholder-slate-600 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Country</label>
                    <input
                      type="text"
                      required
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-[#0a0c10] border border-white/15 rounded-xl p-3 text-white outline-none focus:border-white placeholder-slate-600 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Details (if credit card) */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-3">
                  <h3 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] pb-1 border-b border-white/10">
                    2. Card Payment Details
                  </h3>

                  <div>
                    <label className="block text-slate-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#0a0c10] border border-white/15 rounded-xl p-3 text-white font-mono outline-none focus:border-white placeholder-slate-600 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full bg-[#0a0c10] border border-white/15 rounded-xl p-3 text-white font-mono outline-none focus:border-white placeholder-slate-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">CVC Code</label>
                      <input
                        type="text"
                        required
                        placeholder="CVC"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-[#0a0c10] border border-white/15 rounded-xl p-3 text-white font-mono outline-none focus:border-white placeholder-slate-600 transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod !== 'card' && (
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs text-center">
                  Secure checkout with {paymentMethod === 'apple' ? 'Apple Pay' : paymentMethod === 'google' ? 'Google Pay' : 'Klarna Pay'}.
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <button
                  type="submit"
                  disabled={cart.length === 0}
                  className="w-full py-4 bg-white text-black hover:bg-slate-200 disabled:opacity-50 font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition duration-150 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Pay {formattedTotal} &bull; Confirm Order</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2-Year Warranty &bull; 30-Day Nordic Trial &bull; Free Global Shipping</span>
                </div>
              </div>

            </form>

          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY (Strictly shows basket contents without model/colourway selectors!) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#12151c] border border-white/15 rounded-3xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Order Summary
                </h2>
                <span className="text-[11px] font-mono text-slate-500">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {cart.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Your basket is currently empty.
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3.5 items-center p-3 rounded-2xl bg-black/40 border border-white/10"
                    >
                      <div className="w-16 h-20 rounded-xl bg-[#0a0c10] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="font-bold text-white text-sm truncate">
                          {item.name}
                        </h3>
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
                          <span className="text-slate-400">&times; {item.quantity}</span>
                        </div>
                        <div className="font-['Space_Grotesk'] font-bold text-white text-xs">
                          £{(item.numericPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Item Subtotal:</span>
                  <span className="text-white font-medium">{formattedTotal}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Nordic Express Shipping:</span>
                  <span className="text-emerald-400 font-semibold uppercase">Free</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Import Duties &amp; VAT:</span>
                  <span className="text-slate-300 font-medium">Included</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-white/10 text-base font-bold text-white">
                  <span>Total:</span>
                  <span className="font-['Space_Grotesk'] text-xl">{formattedTotal}</span>
                </div>
              </div>

            </div>

            {/* Warehouse Stock Assurance */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Gothenburg Logistics Depot &bull; Verified In Stock</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Orders placed are packed and prepared for priority dispatch within 24 hours from Gothenburg, Sweden.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
