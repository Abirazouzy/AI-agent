import React from 'react';
import { Bot, Calendar, MessageSquareText, ShoppingBag, TrendingUp, Sparkles } from 'lucide-react';

export type NavigationTab = 'copilot' | 'scheduler' | 'inbox' | 'catalog' | 'playbook';

interface NavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  scheduledCount: number;
  pendingInquiriesCount: number;
  productsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  scheduledCount,
  pendingInquiriesCount,
  productsCount,
}) => {
  const tabs = [
    {
      id: 'copilot' as NavigationTab,
      label: 'Agent IA "Amira"',
      sublabel: 'Stratège & Créateur',
      icon: Bot,
      badge: 'IA Live',
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'scheduler' as NavigationTab,
      label: 'Planning Social',
      sublabel: 'Calendrier & Grille IG',
      icon: Calendar,
      badge: scheduledCount > 0 ? `${scheduledCount} planifiés` : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'inbox' as NavigationTab,
      label: 'Inbox Client & DM',
      sublabel: 'Réponses Prix & Livraison',
      icon: MessageSquareText,
      badge: pendingInquiriesCount > 0 ? `${pendingInquiriesCount} en attente` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 font-bold animate-pulse',
    },
    {
      id: 'catalog' as NavigationTab,
      label: 'Marque & Produits',
      sublabel: 'Catalogue & Voix',
      icon: ShoppingBag,
      badge: `${productsCount} articles`,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'playbook' as NavigationTab,
      label: 'Guide de Croissance',
      sublabel: 'Heures de pic & Hashtags',
      icon: TrendingUp,
      badge: 'Tunisie & Monde',
      badgeColor: 'bg-purple-100 text-purple-700',
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900 shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold">{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tab.badgeColor}`}>
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-600 hidden sm:block">{tab.sublabel}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
