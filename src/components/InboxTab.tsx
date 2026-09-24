import React, { useState } from 'react';
import { CustomerInquiry, BrandProfile, SupportedLanguage } from '../types';
import { generateSmartReply } from '../services/aiService';
import {
  MessageSquareText,
  Sparkles,
  Copy,
  Check,
  Send,
  MessageCircle,
  ExternalLink,
  Instagram,
  Facebook,
  Bot,
  UserCheck,
  CheckCircle,
  Zap,
  ShoppingBag,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface InboxTabProps {
  inquiries: CustomerInquiry[];
  brand: BrandProfile;
  language: SupportedLanguage;
  onUpdateInquiry: (inquiry: CustomerInquiry) => void;
  onAddInquiry: (newInq: CustomerInquiry) => void;
}

export const InboxTab: React.FC<InboxTabProps> = ({
  inquiries,
  brand,
  language,
  onUpdateInquiry,
  onAddInquiry,
}) => {
  const [selectedId, setSelectedId] = useState<string>(inquiries[0]?.id || '');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Custom Simulator state
  const [customMsgInput, setCustomMsgInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const activeInquiry = inquiries.find((i) => i.id === selectedId) || inquiries[0];

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleMarkReplied = (inquiry: CustomerInquiry) => {
    onUpdateInquiry({
      ...inquiry,
      status: 'replied',
    });
  };

  const handleSimulateCustomMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsgInput.trim() || isSimulating) return;

    setIsSimulating(true);
    try {
      const result = await generateSmartReply(brand, customMsgInput, 'instagram');

      const newInq: CustomerInquiry = {
        id: `inq-custom-${Date.now()}`,
        customerName: 'Client Test (Simulation)',
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        platform: 'instagram',
        timestamp: 'À l\'instant',
        message: customMsgInput,
        detectedIntent: result.detectedIntent || 'Demande client personnalisée',
        productMentioned: result.matchedProduct || undefined,
        status: 'pending',
        aiReplies: {
          direct: result.suggestedAnswers?.direct || '',
          converting: result.suggestedAnswers?.converting || '',
          derja_friendly: result.suggestedAnswers?.derja_friendly || '',
        },
        salesTip: result.salesTip,
      };

      onAddInquiry(newInq);
      setSelectedId(newInq.id);
      setCustomMsgInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Inbox Client & Assistant de Réponse Intelligent
            </h2>
            <span className="text-xs bg-amber-50 text-amber-700 font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">
              {inquiries.filter((i) => i.status === 'pending').length} en attente
            </span>
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Générez des réponses instantanées pour les questions fréquentes (« Prix svp », livraisons Sousse/Sfax/Tunis, dispo) en français, anglais ou derja.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-600 block">Délai moyen de réponse IA</span>
            <span className="text-sm font-bold text-emerald-600">&lt; 3 secondes</span>
          </div>
        </div>
      </div>

      {/* Simulator Test Box: Test Any Customer Inquiry */}
      <div className="bg-linear-to-r from-indigo-50 via-purple-50 to-amber-50 p-4 rounded-2xl border border-indigo-100 shadow-xs">
        <form onSubmit={handleSimulateCustomMessage} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Tester un message client en direct (ex: "Prix svp?", "Livraison à Bizerte?", "Kadech soum?") :
            </span>
            <span className="text-[11px] text-slate-700 hidden sm:inline">
              IA connectée au catalogue de {brand.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customMsgInput}
              onChange={(e) => setCustomMsgInput(e.target.value)}
              placeholder="Collez ou tapez une question client reçue sur Instagram/FB/WhatsApp..."
              className="flex-1 bg-white text-slate-900 text-xs sm:text-sm rounded-xl px-4 py-2.5 border border-indigo-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!customMsgInput.trim() || isSimulating}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSimulating ? 'Analyse...' : 'Analyser & Répondre'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Two Column Layout: Inquiries List & Detail Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Messages List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[650px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Demandes récentes</span>
            <span className="text-[11px] text-slate-600">{inquiries.length} conversations</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {inquiries.map((inq) => {
              const isSelected = inq.id === (activeInquiry?.id || '');
              return (
                <div
                  key={inq.id}
                  onClick={() => setSelectedId(inq.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={inq.avatar}
                      alt={inq.customerName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {inq.customerName}
                        </span>
                        <span className="text-[10px] text-slate-600 shrink-0">
                          {inq.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                        "{inq.message}"
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                          {inq.platform === 'instagram' && (
                            <Instagram className="w-2.5 h-2.5 text-pink-600" />
                          )}
                          {inq.platform === 'facebook' && (
                            <Facebook className="w-2.5 h-2.5 text-blue-600" />
                          )}
                          <span className="capitalize">{inq.platform}</span>
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            inq.status === 'replied'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {inq.status === 'replied' ? '✓ Répondu' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Responder Workspace (8 cols) */}
        {activeInquiry && (
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Customer Inquiry Summary Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeInquiry.avatar}
                      alt={activeInquiry.customerName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {activeInquiry.customerName}
                        </h3>
                        <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-600 font-semibold capitalize">
                          {activeInquiry.platform}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">Reçu {activeInquiry.timestamp}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleMarkReplied(activeInquiry)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                      activeInquiry.status === 'replied'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{activeInquiry.status === 'replied' ? 'Répondu' : 'Marquer comme traité'}</span>
                  </button>
                </div>

                {/* Message Body */}
                <div className="pt-3">
                  <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                    Message du client :
                  </span>
                  <p className="text-sm font-semibold text-slate-800 bg-white p-3 rounded-xl border border-slate-200/60">
                    « {activeInquiry.message} »
                  </p>
                </div>

                {/* Intent & Product Badge */}
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-200 text-xs">
                  <span className="font-semibold text-slate-600">Intention détectée :</span>
                  <span className="bg-indigo-100/80 text-indigo-900 font-semibold px-2.5 py-0.5 rounded-md">
                    {activeInquiry.detectedIntent}
                  </span>

                  {activeInquiry.productMentioned && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="bg-amber-100/80 text-amber-900 font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3 text-amber-700" />
                        {activeInquiry.productMentioned}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* 3 AI Suggested Response Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Options de réponses générées par l'IA
                    </h3>
                  </div>
                  <span className="text-xs text-slate-600">
                    Choisissez la réponse la plus adaptée et cliquez pour copier
                  </span>
                </div>

                {/* Option 1: Direct & Informative */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-indigo-300 transition-all shadow-2xs hover:shadow-xs group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      1. Réponse Directe & Efficace (Français / Anglais)
                    </span>
                    <button
                      onClick={() => handleCopy(activeInquiry.aiReplies.direct, 'direct')}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
                    >
                      {copiedType === 'direct' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {activeInquiry.aiReplies.direct}
                  </p>
                </div>

                {/* Option 2: High Converting / Sales Focused */}
                <div className="bg-linear-to-r from-emerald-50/50 to-white rounded-xl p-4 border border-emerald-200/80 hover:border-emerald-400 transition-all shadow-2xs hover:shadow-xs group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      2. Réponse Haute Conversion (Prise de commande rapide)
                    </span>
                    <button
                      onClick={() => handleCopy(activeInquiry.aiReplies.converting, 'converting')}
                      className="px-2.5 py-1 bg-emerald-100/80 hover:bg-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-emerald-300"
                    >
                      {copiedType === 'converting' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {activeInquiry.aiReplies.converting}
                  </p>
                </div>

                {/* Option 3: Franco-Tunisian Derja Friendly */}
                <div className="bg-linear-to-r from-amber-50/50 to-white rounded-xl p-4 border border-amber-200/80 hover:border-amber-400 transition-all shadow-2xs hover:shadow-xs group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      3. Ambiance Locale & Chaleureuse (Franco-Tunisien 🇹🇳)
                    </span>
                    <button
                      onClick={() => handleCopy(activeInquiry.aiReplies.derja_friendly, 'derja')}
                      className="px-2.5 py-1 bg-amber-100/80 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-amber-300"
                    >
                      {copiedType === 'derja' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {activeInquiry.aiReplies.derja_friendly}
                  </p>
                </div>
              </div>

              {/* Sales Tip Advice */}
              {activeInquiry.salesTip && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-700">
                  <span className="text-amber-500 font-bold shrink-0">💡 Conseil Vente :</span>
                  <span>{activeInquiry.salesTip}</span>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-600">
                Paiement à la livraison (COD) : {brand.deliveryInfo.slice(0, 60)}...
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${brand.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Envoyer sur WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
