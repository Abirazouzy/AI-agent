import React, { useState, useEffect } from 'react';
import { SocialPost, BrandProfile, SupportedLanguage, PlatformType, MediaType } from '../types';
import { generateSocialPost, generatePostImage } from '../services/aiService';
import {
  Sparkles,
  Calendar,
  Clock,
  Instagram,
  Facebook,
  MessageCircle,
  Image as ImageIcon,
  Wand2,
  RefreshCw,
  Download,
  Check,
  Camera,
  Layers,
  Eye,
  Sliders,
  Sparkle,
  ArrowRight,
  Palette,
  Sun,
  Flame,
} from 'lucide-react';

interface NewPostModalProps {
  brand: BrandProfile;
  language: SupportedLanguage;
  isOpen: boolean;
  initialPost?: Partial<SocialPost>;
  onClose: () => void;
  onSavePost: (post: SocialPost) => void;
}

type ImageStylePreset = 'studio' | 'mediterranean' | 'lifestyle' | 'editorial';
type AspectRatioOption = '1:1' | '4:5' | '9:16' | '16:9';

export const NewPostModal: React.FC<NewPostModalProps> = ({
  brand,
  language,
  isOpen,
  initialPost,
  onClose,
  onSavePost,
}) => {
  const [platform, setPlatform] = useState<PlatformType>(initialPost?.platform || 'instagram');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [customTopic, setCustomTopic] = useState('');
  const [taskType, setTaskType] = useState<'post' | 'reels_hook' | 'carousel' | 'promo'>('post');
  const [isGenerating, setIsGenerating] = useState(false);

  // Form values
  const [title, setTitle] = useState(initialPost?.title || '');
  const [hook, setHook] = useState(initialPost?.hook || '');
  const [caption, setCaption] = useState(initialPost?.caption || '');
  const [hashtagsStr, setHashtagsStr] = useState(initialPost?.hashtags?.join(', ') || '');
  const [mediaType, setMediaType] = useState<MediaType>(initialPost?.mediaType || 'photo');
  const [mediaUrl, setMediaUrl] = useState(initialPost?.mediaUrl || '');
  const [date, setDate] = useState(() => {
    if (initialPost?.date) return initialPost.date;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState(initialPost?.time || '19:30');
  const [callToAction, setCallToAction] = useState(initialPost?.callToAction || '');
  const [visualPrompt, setVisualPrompt] = useState(initialPost?.visualPrompt || '');

  // AI Image Studio State
  const [isImageStudioOpen, setIsImageStudioOpen] = useState(true);
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState<ImageStylePreset>('studio');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('1:1');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedImagePreview, setGeneratedImagePreview] = useState<string | null>(null);
  const [appliedNotification, setAppliedNotification] = useState(false);
  const [showLiveFeedPreview, setShowLiveFeedPreview] = useState(false);

  // Sync image prompt when visualPrompt changes from AI text generation
  useEffect(() => {
    if (visualPrompt && !imagePrompt) {
      setImagePrompt(visualPrompt);
    }
  }, [visualPrompt]);

  // When initialPost changes
  useEffect(() => {
    if (initialPost) {
      if (initialPost.title) setTitle(initialPost.title);
      if (initialPost.hook) setHook(initialPost.hook);
      if (initialPost.caption) setCaption(initialPost.caption);
      if (initialPost.hashtags) setHashtagsStr(initialPost.hashtags.join(', '));
      if (initialPost.mediaUrl) {
        setMediaUrl(initialPost.mediaUrl);
        setGeneratedImagePreview(initialPost.mediaUrl);
      }
      if (initialPost.visualPrompt) {
        setVisualPrompt(initialPost.visualPrompt);
        setImagePrompt(initialPost.visualPrompt);
      }
    }
  }, [initialPost]);

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    try {
      const selectedProduct = brand.products.find((p) => p.id === selectedProductId);
      const prompt = selectedProduct
        ? `Crée un post percutant pour notre produit "${selectedProduct.name}" (Prix: ${selectedProduct.price} ${brand.currency}, Catégorie: ${selectedProduct.category}). ${customTopic}`
        : customTopic || `Crée un post engageant valorisant le savoir-faire de ${brand.name}.`;

      const result = await generateSocialPost({
        brand,
        taskType,
        prompt,
        language,
        platform,
      });

      setTitle(result.title || `Post ${platform} — ${brand.name}`);
      setHook(result.hook || '');
      setCaption(result.caption || '');
      setHashtagsStr(result.hashtags?.join(', ') || '');
      setCallToAction(result.callToAction || '');
      setVisualPrompt(result.visualPrompt || '');

      // Also set the image prompt for the image studio
      if (result.visualPrompt) {
        setImagePrompt(result.visualPrompt);
      } else if (result.hook) {
        setImagePrompt(`${brand.name}: ${result.hook}`);
      }

      if (selectedProduct?.imageUrl) {
        setMediaUrl(selectedProduct.imageUrl);
        setGeneratedImagePreview(selectedProduct.imageUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Sync image prompt directly from post description
  const handleSyncPromptFromDescription = () => {
    const selectedProduct = brand.products.find((p) => p.id === selectedProductId);
    let promptIdea = '';

    if (visualPrompt) {
      promptIdea = visualPrompt;
    } else if (hook && caption) {
      promptIdea = `${hook} — ${caption.slice(0, 120)}`;
    } else if (selectedProduct) {
      promptIdea = `${selectedProduct.name}, ${selectedProduct.category}. ${selectedProduct.description}`;
    } else if (title) {
      promptIdea = `${title} pour ${brand.name}, univers ${brand.niche}`;
    } else {
      promptIdea = `Collection artisanale de ${brand.name}, élégante mise en scène sous lumière naturelle douce`;
    }

    setImagePrompt(promptIdea);
  };

  // AI Image Generation Handler
  const handleGenerateImage = async () => {
    const activePrompt =
      imagePrompt.trim() ||
      visualPrompt.trim() ||
      hook.trim() ||
      (selectedProductId ? brand.products.find((p) => p.id === selectedProductId)?.name : '') ||
      `${brand.name} collection`;

    setIsGeneratingImage(true);
    setGenerationStep('1/3 Direction artistique & composition...');

    const timer1 = setTimeout(() => {
      setGenerationStep('2/3 Synthèse de la lumière & textures...');
    }, 900);

    const timer2 = setTimeout(() => {
      setGenerationStep('3/3 Rendu haute résolution sans filigrane...');
    }, 1800);

    try {
      const response = await generatePostImage({
        prompt: activePrompt,
        brand,
        style: imageStyle,
        aspectRatio,
        postDescription: `${hook}\n${caption}`,
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (response && response.imageUrl) {
        setGeneratedImagePreview(response.imageUrl);
        setMediaUrl(response.imageUrl);
        setAppliedNotification(true);
        setTimeout(() => setAppliedNotification(false), 2500);
      }
    } catch (err) {
      console.error('Error generating post image:', err);
    } finally {
      setIsGeneratingImage(false);
      setGenerationStep('');
    }
  };

  // Apply previewed image to post
  const handleApplyImageToPost = (url: string) => {
    setMediaUrl(url);
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 2500);
  };

  // Download image helper
  const handleDownloadImage = () => {
    if (!generatedImagePreview) return;
    const a = document.createElement('a');
    a.href = generatedImagePreview;
    a.download = `${brand.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_social_post_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = hashtagsStr
      .split(/[, #]+/)
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const newPost: SocialPost = {
      id: initialPost?.id || `post-${Date.now()}`,
      title: title || `Post ${platform}`,
      platform,
      date,
      time,
      status: 'scheduled',
      hook: hook || 'Nouveau post pour notre communauté',
      caption: caption || 'Découvrez nos créations avec livraison rapide.',
      hashtags: tagsArray.length > 0 ? tagsArray : ['tunisia', 'smallbusiness', 'shoplocal'],
      mediaType,
      mediaUrl: mediaUrl || generatedImagePreview || brand.products[0]?.imageUrl,
      pillar: taskType === 'promo' ? 'Offre Promotionnelle' : 'Product Spotlight',
      callToAction: callToAction || 'Envoyez un message privé pour commander !',
      visualPrompt: imagePrompt || visualPrompt,
    };

    onSavePost(newPost);
    onClose();
  };

  // Quick image styling tag suggestions
  const quickTags = [
    { label: '🌿 Lumière matinale', prompt: 'lumière naturelle douce du matin, ombres délicates' },
    { label: '🏺 Lin & Céramique', prompt: 'nappe en lin brut beige, textures artisanales naturelles' },
    { label: '📸 Macro & Texture', prompt: 'gros plan 50mm, détails fins et textures tangibles' },
    { label: '🌊 Esprit Méditerranéen', prompt: 'ambiance soleil méditerranéen, ocre chaleureux et blanc chaux' },
  ];

  // Signature studio shoot presets for fast 1-click on-brand selection
  const studioPresets = [
    {
      label: 'Céramique Sidi Bou',
      url: '/images/dar_medina_ceramic_plate_1790159538696.jpg',
      desc: 'Plat émaillé bleu cobalt & lin',
    },
    {
      label: 'Bols Terracotta & Ocre',
      url: '/images/dar_medina_terracotta_bowls_1790159551971.jpg',
      desc: 'Terre cuite minérale sur pierre',
    },
    {
      label: 'Sérum Figue Botanique',
      url: '/images/maison_yasmine_serum_1790159563716.jpg',
      desc: 'Flacon ambré & ombre florale',
    },
    {
      label: 'Streetwear Minimal',
      url: '/images/nomad_threads_hoodie_1790159575837.jpg',
      desc: 'Coupe contemporaine sable',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200/90 my-6 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Créateur de Contenu & Studio Visuel IA
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Marque active : <span className="font-semibold text-slate-800">{brand.name}</span> •{' '}
                  <span className="text-indigo-600">{brand.niche}</span>
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* AI Copywriting Quick Bar */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
              Générer le texte & l'angle du post avec l'IA :
            </span>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              Gemini 3.8 Flash
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium text-slate-600 mb-1">Produit à mettre en avant :</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-white p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
              >
                <option value="">-- Aucun (Post d'ambiance ou général) --</option>
                {brand.products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.price} {brand.currency})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">Format de publication :</label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value as any)}
                className="w-full bg-white p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
              >
                <option value="post">Photo Standard (Accroche + Légende élégante)</option>
                <option value="reels_hook">Reel / TikTok Viral (Hook 3 sec + Idée visuelle)</option>
                <option value="carousel">Carrousel Éducatif & Storytelling</option>
                <option value="promo">Offre Vente Flash WhatsApp</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Détail ou angle spécifique (ex: Réassort limité, -15% ce weekend, fête des mères, fabrication...)"
              className="flex-1 bg-white text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={handleGenerateWithAI}
              disabled={isGenerating}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50 shrink-0 cursor-pointer active:scale-95"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Rédaction...' : 'Rédiger le Post'}</span>
            </button>
          </div>
        </div>

        {/* 🎨 AI IMAGE GENERATION STUDIO (HERO FEATURE) */}
        <div className="bg-linear-to-b from-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-5 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Studio Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-indigo-300 border border-white/10">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Studio Visuel IA — Générateur d'Images
                  </h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    On-Brand 8K
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Créez des visuels de haute qualité photographique calibrés sur l'univers de votre marque.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSyncPromptFromDescription}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-indigo-200 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer self-start sm:self-auto"
              title="Pré-remplir le prompt visuel avec les détails du post"
            >
              <Wand2 className="w-3 h-3 text-indigo-300" />
              <span>Synchroniser avec la description</span>
            </button>
          </div>

          {/* Visual Style Preset Selector */}
          <div className="space-y-2 relative z-10">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-300" />
              Style Photographique :
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                {
                  id: 'studio',
                  label: 'Studio Épuré',
                  sub: 'Lumière neutre, 50mm, minimaliste',
                  icon: Camera,
                },
                {
                  id: 'mediterranean',
                  label: 'Méditerranéen',
                  sub: 'Terre cuite, ocre & soleil',
                  icon: Sun,
                },
                {
                  id: 'lifestyle',
                  label: 'Lifestyle Quotidien',
                  sub: 'Table conviviale, lumière douce',
                  icon: Sparkle,
                },
                {
                  id: 'editorial',
                  label: 'Éditorial & Mode',
                  sub: 'Contraste net, contemporain',
                  icon: Layers,
                },
              ].map((s) => {
                const Icon = s.icon;
                const isSelected = imageStyle === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setImageStyle(s.id as ImageStylePreset)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/40 border-indigo-400 text-white shadow-sm ring-1 ring-indigo-400/50'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold leading-none">{s.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{s.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aspect Ratio Selector & Prompt Input */}
          <div className="space-y-3 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                Description créative du visuel (Prompt d'image) :
              </label>

              {/* Aspect Ratio Chips */}
              <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/10">
                {(['1:1', '4:5', '9:16', '16:9'] as AspectRatioOption[]).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      aspectRatio === ratio
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ratio === '1:1' ? '1:1 Carré' : ratio === '4:5' ? '4:5 Portrait' : ratio === '9:16' ? '9:16 Story' : '16:9 Paysage'}
                  </button>
                ))}
              </div>
            </div>

            {/* Input area */}
            <div className="relative">
              <textarea
                rows={2}
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Ex: Vue rapprochée d'une assiette artisanale sur une nappe en lin beige avec citrons frais et branche d'olivier sous une lumière dorée du matin..."
                className="w-full bg-white/5 border border-white/15 focus:border-indigo-400 rounded-2xl p-3 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-400/50 transition-all leading-relaxed"
              />
            </div>

            {/* Quick helper pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-medium">Idées de détails :</span>
              {quickTags.map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setImagePrompt((prev) =>
                      prev ? `${prev.trim()}, ${tag.prompt}` : tag.prompt
                    );
                  }}
                  className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-[10px] font-medium border border-white/10 transition-colors cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Generate Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={isGeneratingImage}
              className="flex-1 py-3 px-5 bg-linear-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingImage ? 'animate-spin' : ''}`} />
              <span>
                {isGeneratingImage
                  ? generationStep || 'Création du visuel en cours...'
                  : 'Générer l\'Image avec l\'IA'}
              </span>
            </button>
          </div>

          {/* Live Generated Preview Area */}
          {(generatedImagePreview || isGeneratingImage) && (
            <div className="mt-4 pt-4 border-t border-white/10 space-y-3 relative z-10 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-300" />
                  Aperçu du Visuel Généré :
                </span>
                {appliedNotification && (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Appliqué à ce post !
                  </span>
                )}
              </div>

              {isGeneratingImage ? (
                <div className="aspect-video w-full rounded-2xl bg-white/5 border border-white/15 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/40 border border-indigo-400 flex items-center justify-center animate-pulse">
                      <Camera className="w-6 h-6 text-indigo-200" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full animate-ping"></span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Génération du visuel haute fidélité...</p>
                    <p className="text-[11px] text-slate-300 mt-0.5">{generationStep}</p>
                  </div>
                </div>
              ) : generatedImagePreview ? (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-black/40 p-3 rounded-2xl border border-white/10">
                  {/* Image Display */}
                  <div className="sm:col-span-5 flex justify-center">
                    <div className="relative group overflow-hidden rounded-xl border border-white/20 shadow-md max-h-56 max-w-full">
                      <img
                        src={generatedImagePreview}
                        alt="Aperçu du visuel généré"
                        referrerPolicy="no-referrer"
                        className="object-cover w-full h-full max-h-56 rounded-xl transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute bottom-2 left-2 text-[9px] font-bold bg-black/70 backdrop-blur-md text-white px-2 py-0.5 rounded-md border border-white/20">
                        {aspectRatio} • {imageStyle}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Details */}
                  <div className="sm:col-span-7 space-y-2.5 text-xs">
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block mb-0.5">
                        Prompt appliqué :
                      </span>
                      <p className="text-slate-200 text-xs line-clamp-2 italic">
                        « {imagePrompt || visualPrompt || 'Cliché de marque'} »
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleApplyImageToPost(generatedImagePreview)}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>✓ Définir comme image du post</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleGenerateImage}
                        disabled={isGeneratingImage}
                        className="px-3 py-2 bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-medium rounded-xl text-xs flex items-center gap-1.5 border border-white/10 cursor-pointer"
                        title="Créer une autre version avec les mêmes paramètres"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Variante</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadImage}
                        className="p-2 bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white rounded-xl text-xs flex items-center gap-1 border border-white/10 cursor-pointer"
                        title="Télécharger sur votre appareil"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Quick Studio Presets Selector */}
          <div className="pt-3 border-t border-white/10 relative z-10">
            <span className="text-[11px] font-semibold text-slate-300 block mb-2">
              Ou sélectionnez instantanément un cliché signature de l'atelier :
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {studioPresets.map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => {
                    setGeneratedImagePreview(preset.url);
                    setMediaUrl(preset.url);
                    setImagePrompt(preset.desc);
                    setAppliedNotification(true);
                    setTimeout(() => setAppliedNotification(false), 2000);
                  }}
                  className="flex items-center gap-2 p-1.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-left transition-all cursor-pointer group"
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover border border-white/20 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <span className="text-[11px] font-bold text-white truncate block group-hover:text-indigo-300">
                      {preset.label}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate block">{preset.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Post Composition Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Platform Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Canal de diffusion :</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['instagram', 'tiktok', 'facebook', 'whatsapp'] as PlatformType[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`py-2 px-3 rounded-xl border font-semibold flex items-center justify-center gap-1.5 capitalize transition-all cursor-pointer ${
                    platform === p
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {p === 'instagram' && <Instagram className="w-3.5 h-3.5 text-pink-500" />}
                  {p === 'facebook' && <Facebook className="w-3.5 h-3.5 text-blue-500" />}
                  {p === 'tiktok' && <span className="font-bold text-[10px]">TT</span>}
                  {p === 'whatsapp' && <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />}
                  <span>{p}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hook (Accroche) */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Accroche (Hook des 3 premières secondes) :
            </label>
            <input
              type="text"
              required
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              placeholder="Ex: Le détail que personne ne remarque mais qui change tout... 🏺✨"
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:bg-white font-medium text-slate-900 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Légende complète (Caption) :</label>
            <textarea
              required
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Texte complet du post avec storytelling, arguments clés, et détails de commande..."
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:bg-white text-xs sm:text-sm leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Hashtags & CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hashtags ciblés :</label>
              <input
                type="text"
                value={hashtagsStr}
                onChange={(e) => setHashtagsStr(e.target.value)}
                placeholder="artisanattunisien, madeintunisia, shoplocal..."
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Appel à l'action (CTA) :</label>
              <input
                type="text"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                placeholder="Ex: Commentez PRIX pour commander en DM !"
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Date, Time & Image URL check */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date de publication :</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Heure (Fuseau Tunis GMT+1) :
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Visuel actif (URL ou généré) :
              </label>
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="Généré par le studio ci-dessus ou URL"
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 truncate"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Prêt pour le planning éditorial</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs shadow-md shadow-slate-900/20 cursor-pointer active:scale-95 transition-all"
              >
                Enregistrer dans le planning
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
