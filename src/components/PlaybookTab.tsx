import React, { useState } from 'react';
import { BrandProfile, SupportedLanguage } from '../types';
import {
  TrendingUp,
  Clock,
  Hash,
  Sparkles,
  Copy,
  Check,
  Flame,
  ShieldCheck,
  MessageCircle,
  Users,
  Compass,
  Calendar,
} from 'lucide-react';

interface PlaybookTabProps {
  brand: BrandProfile;
  language: SupportedLanguage;
}

export const PlaybookTab: React.FC<PlaybookTabProps> = ({ brand, language }) => {
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null);

  const copyTags = (tags: string[], groupName: string) => {
    navigator.clipboard.writeText(tags.map((t) => `#${t}`).join(' '));
    setCopiedGroup(groupName);
    setTimeout(() => setCopiedGroup(null), 2000);
  };

  const hashtagVault = [
    {
      name: 'Artisanat, Poterie & Déco Tunisienne',
      tags: [
        'artisanattunisien',
        'madeintunisia',
        'poterietunisienne',
        'nabeul',
        'sidibousaid',
        'tabledecor',
        'homedecortunisie',
        'artisanal',
        'terroir',
        'tunisiancrafts',
      ],
    },
    {
      name: 'Cosmétique Bio, Soins & Huiles Précieuses',
      tags: [
        'beautetunisienne',
        'figuedebarbarie',
        'neroli',
        'soinnaturel',
        'biotunisie',
        'cleanbeauty',
        'huileprecieuse',
        'rituelbeaute',
        'hammam',
        'organicskincare',
      ],
    },
    {
      name: 'Mode, Streetwear & Créateurs',
      tags: [
        'fashiontunisia',
        'streetweartn',
        'createurtunisien',
        'ootdtunisie',
        'tunisianstyle',
        'lookdujour',
        'amazighart',
        'designertunisie',
        'slowfashion',
      ],
    },
    {
      name: 'E-commerce & Livraison Toute la Tunisie',
      tags: [
        'livraisontoutelatunisie',
        'paiementalalivraison',
        'shoptunisie',
        'bonsplanstn',
        'tunisiashopping',
        'venteligne',
        'tpetunisie',
        'qualitegarantie',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Guide de Croissance & Stratégie Social Media
            </h2>
            <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-2.5 py-0.5 rounded-full border border-purple-200">
              Spécial TPE / PME
            </span>
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Les meilleures pratiques pour percer sur Instagram, TikTok et WhatsApp en Tunisie et à l'international.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Méthode Éprouvée 2026
          </span>
        </div>
      </div>

      {/* Grid: Peak Hours & Algorithm Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Peak Hours Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Heures de Pic de Connexion (Tunisie & Maghreb GMT+1)
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-indigo-950 block">Pause Déjeuner : 12h30 - 14h00</span>
                <p className="text-slate-700 mt-0.5">
                  Idéal pour les posts photos produits, sondages Stories et rappels de promos.
                </p>
              </div>
              <span className="text-xs font-extrabold text-indigo-700 px-2.5 py-1 bg-white rounded-lg shadow-2xs">
                Engagement Fort
              </span>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-950 block">Prime Time Soir : 19h30 - 22h30</span>
                <p className="text-slate-700 mt-0.5">
                  Le pic absolu d'attention en Tunisie ! Moment parfait pour lancer des Reels & TikTok.
                </p>
              </div>
              <span className="text-xs font-extrabold text-amber-700 px-2.5 py-1 bg-white rounded-lg shadow-2xs">
                Pic d'Audience 🔥
              </span>
            </div>

            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-purple-950 block">Dimanche Soir : 20h00 - 23h00</span>
                <p className="text-slate-700 mt-0.5">
                  Moment où les commandes de début de semaine se préparent. Taux de conversion maximal.
                </p>
              </div>
              <span className="text-xs font-extrabold text-purple-700 px-2.5 py-1 bg-white rounded-lg shadow-2xs">
                Conversion Max
              </span>
            </div>
          </div>
        </div>

        {/* Local Market Hacks Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Compass className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">
              4 Règles d'Or pour Vendre en Tunisie
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </div>
              <div>
                <span className="font-bold text-slate-900">Afficher le prix clairement :</span>
                <p className="text-slate-700">
                  Fini le "Prix en PV" ! Les clients récents préfèrent la transparence. Afficher le prix en TND élimine 80% des abandons et attire les acheteurs sérieux.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </div>
              <div>
                <span className="font-bold text-slate-900">Rassurer sur la livraison & le paiement :</span>
                <p className="text-slate-700">
                  Mentionnez toujours « Paiement à la livraison » et « Expédition 24-48h dans toute la Tunisie ». C'est le déclencheur de confiance numéro un.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                3
              </div>
              <div>
                <span className="font-bold text-slate-900">Le canal WhatsApp Business :</span>
                <p className="text-slate-700">
                  Ajoutez un lien direct WhatsApp sur vos Stories et bio Instagram. 70% des clôtures de commandes en Tunisie se font sur messagerie directe.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                4
              </div>
              <div>
                <span className="font-bold text-slate-900">Montrer les coulisses (Storytelling) :</span>
                <p className="text-slate-700">
                  Filmez l'emballage soigné des colis et la préparation artisanale. L'humain convertit 3x plus qu'une photo de catalogue statique.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hashtag Vault */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-pink-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Coffre-fort de Hashtags Ciblés (Copie en 1 Clic)
            </h3>
          </div>
          <span className="text-xs text-slate-600">Optimisé pour la visibilité locale & diaspora</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hashtagVault.map((group, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{group.name}</span>
                <button
                  onClick={() => copyTags(group.tags, group.name)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
                >
                  {copiedGroup === group.name ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copier tout</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {group.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
