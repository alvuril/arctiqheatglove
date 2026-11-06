import React from 'react';
import { CompanyInfo } from '../types.ts';
import { ArrowRight, MapPin, Mail, ShieldCheck, Compass, Thermometer } from 'lucide-react';

interface CompanyHomeProps {
  company: CompanyInfo;
  onNavigateToProduct: () => void;
}

export const CompanyHome: React.FC<CompanyHomeProps> = ({
  company,
  onNavigateToProduct,
}) => {
  return (
    <div className="space-y-16 py-12 px-6 max-w-5xl mx-auto">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-6 pb-2">
        
        {/* Subtle Swedish Origin Tag */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-slate-400">
          <span>Gothenburg, Sweden</span>
          <span aria-hidden="true" className="text-slate-600">&bull;</span>
          <span className="text-white">Nordic Thermal Engineering</span>
        </div>

        {/* Company Name & Slogan */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-7xl font-['Space_Grotesk'] font-extrabold tracking-tight text-white uppercase">
            {company.name}
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 font-medium max-w-2xl mx-auto">
            {company.slogan}
          </p>
        </div>

        {/* About Company */}
        <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed">
          {company.about}
        </p>

        {/* Primary CTA */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={onNavigateToProduct}
            className="px-8 py-4 bg-white text-black hover:bg-slate-200 font-bold text-xs tracking-widest uppercase rounded-xl transition duration-150 flex items-center gap-2 cursor-pointer shadow-lg shadow-white/5"
          >
            <span>Explore The HeatGlove &mdash; £159.99</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </section>

      {/* Company Focuses & Values */}
      <section className="space-y-8 border-t border-white/10 pt-12">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-['Space_Grotesk'] font-extrabold text-white tracking-tight uppercase">
            Core Focus
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {company.values.map((val, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#12151c] border border-white/10 space-y-3 hover:border-white/20 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                {idx === 0 && <Compass className="w-4 h-4 text-sky-400" />}
                {idx === 1 && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                {idx === 2 && <Thermometer className="w-4 h-4 text-orange-400" />}
              </div>

              <h3 className="font-bold text-white text-base">
                {val.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Location Strip */}
      <section className="border-t border-white/10 pt-10 pb-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span>Headquarters: <strong className="text-white font-medium">{company.location}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-slate-400" />
          <span>Direct Contact: <a href={`mailto:${company.contactEmail}`} className="text-white hover:underline font-mono">{company.contactEmail}</a></span>
        </div>
      </section>

    </div>
  );
};
