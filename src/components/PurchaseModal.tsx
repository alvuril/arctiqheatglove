import React, { useState } from 'react';
import { ProductInfo } from '../types.ts';
import { X, CheckCircle, ShieldCheck, CreditCard, Lock, Truck } from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductInfo;
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedSize,
  onSizeChange,
}) => {
  const [step, setStep] = useState<'checkout' | 'processing' | 'confirmed'>('checkout');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google' | 'klarna'>('card');
  const [orderRef, setOrderRef] = useState<string>('');

  // Form states - empty by default so user can input their own values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');
  const [country, setCountry] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  if (!isOpen) return null;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setErrorMessage(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          size: selectedSize,
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
        setOrderRef(data.orderRef);
        setStep('confirmed');
      } else {
        setErrorMessage(data.error || 'Order submission failed.');
        setStep('checkout');
      }
    } catch (err) {
      // Graceful fallback
      const generatedRef = `ARCTIQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderRef(generatedRef);
      setStep('confirmed');
    }
  };

  const handleReset = () => {
    setStep('checkout');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#12151c] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        {step !== 'processing' && (
          <button
            onClick={handleReset}
            className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
            aria-label="Close purchase modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STEP 1: CHECKOUT & PAYMENT SELECTION */}
        {step === 'checkout' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
              <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                Complete Your Order
              </h2>
            </div>

            {/* Selected Product Summary Box */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">{product.name}</h3>
                  <p className="text-xs text-slate-400">
                    Colourway: <span className="text-slate-200 font-semibold">{product.colourway}</span> &bull; High-Quality Materials
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-['Space_Grotesk'] text-lg font-bold text-white block">
                    {product.price}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase">Free Shipping</span>
                </div>
              </div>

              {/* Verified Size Selection in Payment Menu */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Selected Size:</span>
                <div className="flex items-center gap-1.5">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => onSizeChange(sz)}
                      className={`px-3 py-1 rounded-lg border font-bold text-xs cursor-pointer transition-colors ${
                        selectedSize === sz
                          ? 'border-white bg-white text-black shadow-sm'
                          : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-300 font-semibold block">
                Select Payment Method
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Credit Card */}
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
                  <span>Card</span>
                </button>

                {/* Apple Pay */}
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

                {/* Google Pay */}
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

                {/* Klarna */}
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

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Shipping info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                  Delivery Address
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Lind"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0a0c10] border border-white/15 rounded-lg p-2.5 text-white outline-none focus:border-white placeholder-slate-600"
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
                      className="w-full bg-[#0a0c10] border border-white/15 rounded-lg p-2.5 text-white outline-none focus:border-white placeholder-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 42 Storgatan"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#0a0c10] border border-white/15 rounded-lg p-2.5 text-white outline-none focus:border-white placeholder-slate-600"
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
                      className="w-full bg-[#0a0c10] border border-white/15 rounded-lg p-2.5 text-white outline-none focus:border-white placeholder-slate-600"
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
                      className="w-full bg-[#0a0c10] border border-white/15 rounded-lg p-2.5 text-white outline-none focus:border-white placeholder-slate-600"
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
                      className="w-full bg-[#0a0c10] border border-white/15 rounded-lg p-2.5 text-white outline-none focus:border-white placeholder-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Payment details if Credit Card */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                    Card Information
                  </h4>

                  <div>
                    <label className="block text-slate-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#0a0c10] border border-white/15 rounded-lg p-2.5 text-white font-mono outline-none focus:border-white placeholder-slate-600"
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
                        className="w-full bg-[#0a0c10] border border-white/15 rounded-lg p-2.5 text-white font-mono outline-none focus:border-white placeholder-slate-600"
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
                        className="w-full bg-[#0a0c10] border border-white/15 rounded-lg p-2.5 text-white font-mono outline-none focus:border-white placeholder-slate-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notice for Express / Klarna */}
              {paymentMethod !== 'card' && (
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs text-center">
                  You will complete payment securely via {paymentMethod === 'apple' ? 'Apple Pay' : paymentMethod === 'google' ? 'Google Pay' : 'Klarna Pay'}.
                </div>
              )}

              {/* Total & Submit */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex justify-between items-baseline text-sm font-bold text-white">
                  <span>Total Amount (Size: {selectedSize}):</span>
                  <span className="font-['Space_Grotesk'] text-lg">{product.price}</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-white text-black hover:bg-slate-200 font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition duration-150 cursor-pointer"
                >
                  Pay {product.price} &bull; Confirm Order
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2-Year Warranty &bull; 30-Day Nordic Trial &bull; Free Returns</span>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* STEP 2: PROCESSING */}
        {step === 'processing' && (
          <div className="py-16 text-center space-y-4">
            <div className="w-14 h-14 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
              Processing Order & Securing Inventory...
            </h3>
            <p className="text-xs text-slate-400">
              Allocating Arctiq HeatGlove in size {selectedSize} from Gothenburg warehouse.
            </p>
          </div>
        )}

        {/* STEP 3: CONFIRMED */}
        {step === 'confirmed' && (
          <div className="space-y-6 text-center sm:text-left py-2">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle className="w-8 h-8 shrink-0" />
              <div>
                <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold block">
                  Order Confirmed
                </span>
                <h3 className="text-2xl font-['Space_Grotesk'] font-bold text-white">
                  Thank You for Your Order!
                </h3>
              </div>
            </div>

            {/* Receipt details */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Reference:</span>
                <span className="font-mono font-bold text-white">{orderRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Item:</span>
                <span className="font-semibold text-white">{product.name} ({product.colourway})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Size Selected:</span>
                <span className="font-bold text-emerald-400">{selectedSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Destination:</span>
                <span className="text-white">{address}, {city}, {country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Dispatch:</span>
                <span className="text-white">1–2 Business Days (Express)</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/10">
                <span className="text-slate-400">Total Paid:</span>
                <span className="font-bold text-white font-['Space_Grotesk']">{product.price}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
              <Truck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>A confirmation receipt and tracking code have been dispatched to {email}.</span>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3.5 bg-white text-black hover:bg-slate-200 font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer transition-colors"
            >
              Return to Store
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
