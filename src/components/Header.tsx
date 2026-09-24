import React from 'react';
import { BrandProfile, SupportedLanguage } from '../types';
import { Sparkles, Globe, Plus, Building2, Store, MessageCircle, MapPin, Zap } from 'lucide-react';

interface HeaderProps {
  currentBrand: BrandProfile;
  allBrands: BrandProfile[];
  onSelectBrand: (brand: BrandProfile) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenNewPost: () => void;
  onOpenBusinessModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentBrand,
  allBrands,
  onSelectBrand,
  language,
  onLanguageChange,
  onOpenNewPost,
  onOpenBusinessModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">El-Agent AI</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    Bilingual Copilot
                  </span>
                </div>
                <p className="text-xs text-slate-700 hidden sm:block">
                  Social Media & Customer Engagement for Small Businesses
                </p>
              </div>
            </div>

            {/* Brand Selector Dropdown */}
            <div className="hidden md:flex items-center pl-4 border-l border-slate-200">
              <div className="relative group">
                <select
                  value={currentBrand.id}
                  onChange={(e) => {
                    const found = allBrands.find((b) => b.id === e.target.value);
                    if (found) onSelectBrand(found);
                  }}
                  className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg pl-8 pr-8 py-2 border border-slate-200 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  {allBrands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.niche.split(',')[0]})
                    </option>
                  ))}
                </select>
                <Store className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                onClick={onOpenBusinessModal}
                title="Gérer ou modifier l'entreprise"
                className="ml-2 p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
              >
                <Building2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Badges & Actions */}
          <div className="flex items-center gap-3">
            {/* Location & Timezone info */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Tunis (GMT+1) & Global</span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-slate-700">{currentBrand.currency}</span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => onLanguageChange('fr')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  language === 'fr'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Français"
              >
                FR
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('tn')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                  language === 'tn'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Franco-Tunisien (Derja friendly)"
              >
                TN 🇹🇳
              </button>
            </div>

            {/* WhatsApp Quick Link */}
            <a
              href={`https://wa.me/${currentBrand.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              title="WhatsApp Business Direct"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* New Post Button */}
            <button
              onClick={onOpenNewPost}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Post IA</span>
            </button>
          </div>
        </div>

        {/* Mobile brand selector strip */}
        <div className="md:hidden py-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-amber-600" />
            {currentBrand.name}
          </span>
          <button
            onClick={onOpenBusinessModal}
            className="text-indigo-600 font-medium hover:underline text-xs"
          >
            Changer d'entreprise →
          </button>
        </div>
      </div>
    </header>
  );
};
