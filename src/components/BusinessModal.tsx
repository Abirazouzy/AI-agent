import React, { useState } from 'react';
import { BrandProfile } from '../types';
import { Building2, Plus, Check, Store, Sparkles, MapPin, DollarSign, Phone } from 'lucide-react';

interface BusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBrand: BrandProfile;
  allBrands: BrandProfile[];
  onSelectBrand: (brand: BrandProfile) => void;
  onAddBrand: (brand: BrandProfile) => void;
}

export const BusinessModal: React.FC<BusinessModalProps> = ({
  isOpen,
  onClose,
  currentBrand,
  allBrands,
  onSelectBrand,
  onAddBrand,
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [niche, setNiche] = useState('');
  const [location, setLocation] = useState('Tunis, Tunisie');
  const [currency, setCurrency] = useState('TND');
  const [tone, setTone] = useState('Chaleureux, professionnel, accueillant');
  const [deliveryInfo, setDeliveryInfo] = useState(
    'Livraison 24-48h sur toute la Tunisie avec paiement à la livraison.'
  );
  const [whatsappNumber, setWhatsappNumber] = useState('+216 20 000 000');
  const [story, setStory] = useState('');

  const handleCreateBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newBrand: BrandProfile = {
      id: `custom-brand-${Date.now()}`,
      name,
      tagline: tagline || 'Petite entreprise passionnée',
      niche: niche || 'Commerce & Artisanat',
      location,
      currency,
      tone,
      targetAudience: 'Clients fidèles recherchant la qualité et le service local',
      deliveryInfo,
      story: story || 'Créée avec passion pour offrir le meilleur service.',
      instagramHandle: `@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      facebookPage: name,
      whatsappNumber,
      accentColor: '#4f46e5',
      products: [
        {
          id: `p-${Date.now()}-1`,
          name: 'Article Phare',
          price: 45,
          category: 'Bestseller',
          description: 'Notre création la plus appréciée par nos clients.',
          imageUrl:
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
          inStock: true,
          tag: 'Coup de cœur',
        },
      ],
    };

    onAddBrand(newBrand);
    onSelectBrand(newBrand);
    setIsCreatingNew(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Gérer les Entreprises</h3>
              <p className="text-xs text-slate-700">
                Passez d'une boutique à l'autre ou créez la vôtre
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-800 text-sm font-bold p-1 rounded-lg hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {!isCreatingNew ? (
          <div className="space-y-4">
            <div className="space-y-2.5">
              {allBrands.map((b) => {
                const isSelected = b.id === currentBrand.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      onSelectBrand(b);
                      onClose();
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-300 shadow-2xs'
                        : 'bg-slate-50/60 hover:bg-slate-100/70 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                        {b.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{b.name}</h4>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                            {b.currency}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 mt-0.5">{b.niche}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">📍 {b.location}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="flex items-center gap-1 text-xs font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs">
                        <Check className="w-3.5 h-3.5" />
                        Actif
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsCreatingNew(true)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une Nouvelle Entreprise Personnalisée</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreateBusiness} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nom de l'entreprise :
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Pâtisserie Masmoudi, Jasmin Bijoux, BioTunisie..."
                className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus:bg-white text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Secteur / Niche :</label>
                <input
                  type="text"
                  required
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="ex: Gastronomie, Céramique, Prêt-à-porter..."
                  className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Devise :</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus:bg-white text-xs"
                >
                  <option value="TND">TND (Dinar Tunisien)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ville / Localisation :
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Tunis, Sousse, Sfax, ou International"
                  className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  WhatsApp Business :
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+216 20 000 000"
                  className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus:bg-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Livraison & Paiement (Frais & Délais) :
              </label>
              <input
                type="text"
                value={deliveryInfo}
                onChange={(e) => setDeliveryInfo(e.target.value)}
                placeholder="Livraison 24-48h sur toute la Tunisie (7 DT) avec paiement à la livraison."
                className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus:bg-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ton de communication :
              </label>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder="Chaleureux, élégant, décontracté, fier du terroir..."
                className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus:bg-white text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
              >
                Retour
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs"
              >
                Créer et activer cette entreprise
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
