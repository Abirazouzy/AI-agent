import React, { useState, useRef, useEffect } from 'react';
import { BrandProfile, SupportedLanguage, SocialPost } from '../types';
import { sendAgentChatMessage } from '../services/aiService';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  CalendarPlus,
  Flame,
  Calendar,
  MessageCircle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  Camera,
  Layers,
  Wand2,
  SlidersHorizontal,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface CopilotTabProps {
  brand: BrandProfile;
  language: SupportedLanguage;
  onAddPostToSchedule: (post: Partial<SocialPost>) => void;
  onOpenImageStudio?: (draft: Partial<SocialPost>) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: string;
  isDraftPost?: boolean;
}

export const CopilotTab: React.FC<CopilotTabProps> = ({
  brand,
  language,
  onAddPostToSchedule,
  onOpenImageStudio,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'agent',
      content:
        language === 'en'
          ? `Hello! I'm **Amira**, your creative AI Social Media & Visual Copilot for **${brand.name}**.\n\nI have synchronized your brand profile, visual aesthetic, and catalog of **${brand.products.length} artisanal products**.\n\nWhat would you like to create today? We can generate high-converting viral hooks, craft a full weekly calendar, or design on-brand imagery in our AI Image Studio.`
          : language === 'tn'
          ? `Marhba bik ! Ena **Amira**, votre directrice artistique & copilote IA pour les réseaux sociaux de **${brand.name}** 🇹🇳.\n\nFhemtek belgdé : l'univers de marque, vos **${brand.products.length} articles** en stock w l'esprit de vos clients.\n\nKiféch n3awnek lyoum ? Des hooks Reels qui cartonnent, un calendrier 7 jours, ou générer un visuel haute résolution pour votre prochain post ?`
          : `Bonjour ! Je suis **Amira**, votre directrice artistique & copilote IA réseaux sociaux dédiée à **${brand.name}**.\n\nJ'ai analysé en détail l'univers de votre marque, votre audience et vos **${brand.products.length} produits** en catalogue.\n\nQue souhaitez-vous créer aujourd'hui ? Nous pouvons concevoir des hooks viraux, planifier la semaine, ou générer les visuels parfaits dans le Studio Visuel IA.`,
      timestamp: 'À l\'instant',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'hooks' | 'planning' | 'visuals' | 'sales'>('all');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Creative Prompt Capsules
  const promptCapsules = [
    {
      id: 'hooks',
      icon: Flame,
      category: 'Virals & Reels',
      label: '5 Hooks Viraux Reels (3 sec)',
      desc: 'Accroches qui captivent dès la première seconde',
      prompt: `Génère 5 idées de vidéos courtes (Reels / TikTok) avec des hooks captivants pour notre boutique "${brand.name}". Inclus le concept visuel et le texte pour les 3 premières secondes.`,
    },
    {
      id: 'visuals',
      icon: Camera,
      category: 'Studio Visuel',
      label: 'Direction Artistique & Prompt Visuel',
      desc: 'Brief photo complet & ambiance esthétique',
      prompt: `Propose une direction artistique photographique pour mettre en valeur les créations de "${brand.name}". Décris la composition, la lumière naturelle, les textures d'arrière-plan et propose 3 prompts d'images détaillés prêts pour le studio IA.`,
    },
    {
      id: 'planning',
      icon: Calendar,
      category: 'Stratégie',
      label: 'Calendrier Éditorial 7 Jours',
      desc: 'Piliers de contenu, heures de pic et formats variés',
      prompt: `Crée un planning éditorial complet de 7 jours pour "${brand.name}". Inclus les piliers de contenu (produit, coulisses, preuve sociale, offre promo) et les meilleures heures de publication pour la Tunisie et l'international.`,
    },
    {
      id: 'sales',
      icon: MessageCircle,
      category: 'Conversion',
      label: 'Post Vente Express WhatsApp',
      desc: 'Offre irrésistible avec commande en 1 clic',
      prompt: `Rédige un post percutant à fort taux de conversion pour Instagram & Facebook, mettant en avant un appel à l'action direct vers notre WhatsApp (${brand.whatsappNumber}) avec livraison 24-48h sur toute la Tunisie.`,
    },
    {
      id: 'sales',
      icon: Lightbulb,
      category: 'Astuces',
      label: 'Stratégie "Prix en Privé"',
      desc: 'Convertir les curieux en commandes fermes',
      prompt: `Comment transformer les commentaires "Prix svp" en commandes fermes ? Donne-moi 3 scripts de réponse chaleureux et une stratégie pour maximiser le taux de conversion sur notre boutique.`,
    },
  ];

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!userText) setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMessage].map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        content: m.content,
      }));

      const reply = await sendAgentChatMessage(brand, history, language);

      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        sender: 'agent',
        content:
          'Une légère interruption réseau est survenue. N\'hésitez pas à relancer votre demande, je suis prête !',
        timestamp: 'Erreur',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Extract structured draft from message
  const extractDraftFromContent = (content: string): Partial<SocialPost> => {
    const lines = content.split('\n').filter((l) => l.trim().length > 0);
    const title = lines[0]?.replace(/[#*]/g, '').slice(0, 50) || `Post ${brand.name}`;
    const hook = lines[1]?.replace(/[#*]/g, '').slice(0, 120) || lines[0] || 'Découvrez notre création !';

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      title,
      hook,
      caption: content,
      platform: 'instagram',
      date: tomorrow.toISOString().split('T')[0],
      time: '19:30',
      status: 'scheduled',
      hashtags: [
        brand.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
        'artisanat',
        'tunisie',
        'shoplocal',
        'madeintunisia',
      ],
      mediaType: 'photo',
      mediaUrl: brand.products[0]?.imageUrl,
      visualPrompt: `Photo soignée de ${brand.name}, lumière naturelle douce, texture lin et céramique`,
      callToAction: 'Envoyez un message privé ou WhatsApp pour commander !',
    };
  };

  const handleQuickAddAsPost = (content: string) => {
    const draft = extractDraftFromContent(content);
    onAddPostToSchedule(draft);
  };

  const handleOpenInImageStudio = (content: string) => {
    const draft = extractDraftFromContent(content);
    if (onOpenImageStudio) {
      onOpenImageStudio(draft);
    } else {
      onAddPostToSchedule(draft);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
        {/* Left Column: Brand Intelligence & Creative Dock (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Persona Header Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-slate-900 via-indigo-900 to-purple-800 text-white flex items-center justify-center font-bold text-base shadow-sm ring-2 ring-indigo-500/20">
                  <Sparkles className="w-6 h-6 text-indigo-300" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight truncate">
                    Amira • Directrice IA
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    Live
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium truncate">
                  Copilote Réseaux Sociaux & Visuels
                </p>
              </div>
            </div>

            {/* Brand Synchronized Context Chipset */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                Mémoire de Marque Synchronisée
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-700 block">Boutique</span>
                  <span className="font-bold text-slate-900 truncate block">{brand.name}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-700 block">Secteur</span>
                  <span className="font-bold text-slate-900 truncate block">{brand.niche}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-700 block">Catalogue actif</span>
                  <span className="font-bold text-indigo-700 block">
                    {brand.products.length} articles ({brand.currency})
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-700 block">Livraison</span>
                  <span className="font-bold text-emerald-700 block">24-48h express</span>
                </div>
              </div>

              {/* Ton de la marque */}
              <div className="bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100 text-xs text-indigo-950 font-medium leading-relaxed">
                <span className="font-bold block text-indigo-900 text-[11px] mb-0.5">
                  Ton éditorial :
                </span>
                « {brand.tone} »
              </div>
            </div>
          </div>

          {/* Creative Prompts Dock */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Actions Rapides & Hooks
              </span>
              <span className="text-[10px] text-slate-400 font-medium">1-Click</span>
            </div>

            <div className="space-y-2">
              {promptCapsules.map((capsule, index) => {
                const Icon = capsule.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSend(capsule.prompt)}
                    disabled={isLoading}
                    className="w-full text-left p-3 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white rounded-2xl border border-white/10 hover:border-indigo-400/40 text-xs font-medium transition-all flex items-start gap-2.5 group cursor-pointer active:scale-98"
                  >
                    <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white shrink-0 transition-colors mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs truncate group-hover:text-indigo-200">
                          {capsule.label}
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors shrink-0" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{capsule.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Catchy Minimal Chat Feed (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-[750px] bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Top Bar */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-800">
                Session Active • IA Directrice de Marque
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-500">
                Langue : <span className="font-semibold text-slate-700 uppercase">{language}</span>
              </span>
            </div>

            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'welcome-reset',
                    sender: 'agent',
                    content: `Session réinitialisée. Comment puis-je vous accompagner aujourd'hui pour **${brand.name}** ?`,
                    timestamp: 'À l\'instant',
                  },
                ]);
              }}
              title="Nouvelle conversation"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px] font-semibold">Nouveau chat</span>
            </button>
          </div>

          {/* Messages Scroll Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {messages.map((msg) => {
              const isAgent = msg.sender === 'agent';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
                >
                  {isAgent && (
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                    </div>
                  )}

                  <div className="max-w-[90%] sm:max-w-[82%] space-y-2">
                    {/* Message Bubble */}
                    <div
                      className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        isAgent
                          ? 'bg-slate-50/90 text-slate-900 border border-slate-200/80 rounded-tl-xs shadow-2xs font-normal'
                          : 'bg-indigo-600 text-white rounded-tr-xs shadow-md font-medium'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Agent Action Bar under bubble */}
                    <div
                      className={`flex flex-wrap items-center gap-2 text-[11px] text-slate-500 px-1 ${
                        isAgent ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <span>{msg.timestamp}</span>

                      {isAgent && (
                        <>
                          <span className="text-slate-300">•</span>
                          <button
                            onClick={() => copyToClipboard(msg.content, msg.id)}
                            className="hover:text-indigo-600 flex items-center gap-1 transition-colors font-medium cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600 font-bold">Copié !</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copier</span>
                              </>
                            )}
                          </button>

                          <span className="text-slate-300">•</span>
                          <button
                            onClick={() => handleQuickAddAsPost(msg.content)}
                            className="hover:text-indigo-700 flex items-center gap-1 transition-colors font-semibold text-indigo-600 cursor-pointer"
                            title="Planifier directement dans le calendrier éditorial"
                          >
                            <CalendarPlus className="w-3 h-3" />
                            <span>Planifier ce post</span>
                          </button>

                          <span className="text-slate-300">•</span>
                          <button
                            onClick={() => handleOpenInImageStudio(msg.content)}
                            className="hover:text-purple-700 flex items-center gap-1 transition-colors font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-lg border border-purple-200 cursor-pointer"
                            title="Ouvrir le Studio Visuel IA pour générer l'image de ce post"
                          >
                            <Camera className="w-3 h-3 text-purple-600" />
                            <span>Studio Visuel IA</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {!isAgent && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-700 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 justify-start animate-in fade-in duration-200">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                </div>
                <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 rounded-tl-xs flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-xs text-slate-700 font-medium">
                    Amira analyse l'univers de marque et prépare la proposition...
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions Strip above input */}
          <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              Suggérer :
            </span>
            {[
              '🔥 Post Soldes d\'été avec livraison offerte',
              '📸 Idée de visuel pour notre best-seller',
              '📦 Script de relance client WhatsApp',
              '✨ 3 Stories interactives avec sondage',
            ].map((sugg, sIdx) => (
              <button
                key={sIdx}
                type="button"
                onClick={() => handleSend(sugg)}
                className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shrink-0 font-medium transition-colors cursor-pointer"
              >
                {sugg}
              </button>
            ))}
          </div>

          {/* Chat Composer Input */}
          <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  language === 'en'
                    ? 'Message Amira: brainstorm viral reels, schedule a week, or craft visual briefs...'
                    : language === 'tn'
                    ? 'Ekteb el Amira: a3tini 5 idées Reels, planifi el semaine, wela soumou...'
                    : 'Demandez à Amira : idées de posts, hooks Reels, promo soldes, brief visuel...'
                }
                className="flex-1 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 text-xs sm:text-sm rounded-2xl px-4 py-3 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-5 py-3 bg-slate-900 hover:bg-black disabled:opacity-40 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-900/20 active:scale-95 shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Envoyer</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
