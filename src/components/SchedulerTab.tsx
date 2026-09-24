import React, { useState } from 'react';
import { SocialPost, PlatformType, BrandProfile, SupportedLanguage } from '../types';
import { generateAutoCalendar } from '../services/aiService';
import {
  Calendar as CalendarIcon,
  Grid,
  ListFilter,
  Plus,
  Sparkles,
  Clock,
  Instagram,
  Facebook,
  Share2,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  MessageCircle,
  Eye,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface SchedulerTabProps {
  posts: SocialPost[];
  brand: BrandProfile;
  language: SupportedLanguage;
  onOpenNewPost: () => void;
  onUpdatePost: (updatedPost: SocialPost) => void;
  onDeletePost: (postId: string) => void;
  onBulkAddPosts: (newPosts: SocialPost[]) => void;
}

export const SchedulerTab: React.FC<SchedulerTabProps> = ({
  posts,
  brand,
  language,
  onOpenNewPost,
  onUpdatePost,
  onDeletePost,
  onBulkAddPosts,
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [isGeneratingAuto, setIsGeneratingAuto] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPosts = posts.filter((post) => {
    if (selectedPlatform === 'all') return true;
    return post.platform === selectedPlatform;
  });

  const handleGenerateWeek = async () => {
    setIsGeneratingAuto(true);
    try {
      const generated = await generateAutoCalendar(brand, 'grow_engagement', language);
      onBulkAddPosts(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAuto(false);
    }
  };

  const copyPostCaption = (post: SocialPost) => {
    const fullText = `${post.hook}\n\n${post.caption}\n\n${post.hashtags.map((h) => `#${h}`).join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPlatformIcon = (platform: PlatformType) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-pink-600" />;
      case 'facebook':
        return <Facebook className="w-3.5 h-3.5 text-blue-600" />;
      case 'tiktok':
        return <span className="font-extrabold text-[10px] text-slate-900">TT</span>;
      case 'whatsapp':
        return <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Share2 className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  const getPlatformBadge = (platform: PlatformType) => {
    switch (platform) {
      case 'instagram':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'facebook':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'tiktok':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'whatsapp':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Planning & Calendrier Éditorial</h2>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
              {posts.length} posts au planning
            </span>
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Gérez vos publications Instagram, Facebook, TikTok et WhatsApp avec prévisualisation du feed.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Planning</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grille Instagram</span>
            </button>
          </div>

          {/* AI 7-day Calendar Generator */}
          <button
            onClick={handleGenerateWeek}
            disabled={isGeneratingAuto}
            className="flex items-center gap-2 px-3.5 py-2 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGeneratingAuto ? 'Génération IA en cours...' : 'Générer 7 Jours Auto'}</span>
          </button>

          {/* New Post Button */}
          <button
            onClick={onOpenNewPost}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un Post</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs by Platform */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-600 font-medium mr-1 flex items-center gap-1">
          <ListFilter className="w-3.5 h-3.5" /> Filtrer :
        </span>
        {['all', 'instagram', 'tiktok', 'facebook', 'whatsapp'].map((plat) => (
          <button
            key={plat}
            onClick={() => setSelectedPlatform(plat)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors capitalize ${
              selectedPlatform === plat
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {plat === 'all' ? 'Tous les canaux' : plat}
          </button>
        ))}
      </div>

      {/* View: Timeline / Schedule List */}
      {viewMode === 'timeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Card Media Preview (if available) */}
              {post.mediaUrl ? (
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={post.mediaUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border backdrop-blur-md bg-white/90 shadow-2xs ${getPlatformBadge(
                        post.platform
                      )}`}
                    >
                      {getPlatformIcon(post.platform)}
                      <span className="capitalize">{post.platform}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {post.mediaType.toUpperCase()}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border ${getPlatformBadge(
                      post.platform
                    )}`}
                  >
                    {getPlatformIcon(post.platform)}
                    <span className="capitalize">{post.platform}</span>
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">
                    {post.pillar}
                  </span>
                </div>
              )}

              {/* Card Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                    <div className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{post.date} à {post.time}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        post.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {post.status === 'published' ? 'Publié' : 'Planifié'}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{post.title}</h3>
                  <p className="text-xs text-indigo-600 font-semibold line-clamp-2 mt-1">
                    "{post.hook}"
                  </p>
                  <p className="text-xs text-slate-700 line-clamp-3 mt-1.5 leading-relaxed">
                    {post.caption}
                  </p>
                </div>

                {/* Hashtags Strip */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {post.hashtags.slice(0, 4).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                  {post.hashtags.length > 4 && (
                    <span className="text-[10px] text-slate-600 font-semibold">
                      +{post.hashtags.length - 4}
                    </span>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => copyPostCaption(post)}
                    className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                  >
                    {copiedId === post.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier texte</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onUpdatePost({
                        ...post,
                        status: post.status === 'published' ? 'scheduled' : 'published',
                      });
                    }}
                    title={post.status === 'published' ? 'Remettre en planifié' : 'Marquer comme publié'}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      post.status === 'published'
                        ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                        : 'text-slate-600 hover:text-emerald-600 bg-slate-50 border-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeletePost(post.id)}
                    title="Supprimer du planning"
                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredPosts.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
              <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">Aucun post planifié pour ce filtre</h3>
              <p className="text-xs text-slate-700 mt-1 max-w-sm mx-auto">
                Cliquez sur "Générer 7 Jours Auto" ou créez votre premier post avec l'aide de l'IA.
              </p>
              <button
                onClick={onOpenNewPost}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                + Créer un Post Maintenant
              </button>
            </div>
          )}
        </div>
      )}

      {/* View: Instagram 3x3 Aesthetic Grid Mockup */}
      {viewMode === 'grid' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-3xl mx-auto shadow-xs">
          {/* Simulated Instagram Profile Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-linear-to-tr from-amber-500 via-pink-600 to-indigo-600 p-0.5">
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  <div className="w-full h-full rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                    {brand.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{brand.instagramHandle}</span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                    Aperçu Grille
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-700 mt-0.5">{brand.name}</p>
                <p className="text-xs text-slate-700 mt-0.5">{brand.tagline}</p>
                <p className="text-xs text-indigo-600 font-medium mt-1">📍 {brand.location}</p>
              </div>
            </div>

            <div className="hidden sm:flex gap-4 text-center text-xs">
              <div>
                <span className="block font-bold text-slate-900">{posts.length}</span>
                <span className="text-slate-600">posts</span>
              </div>
              <div>
                <span className="block font-bold text-slate-900">4.8k</span>
                <span className="text-slate-600">abonnés</span>
              </div>
            </div>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6">
            {posts
              .filter((p) => p.mediaUrl)
              .slice(0, 9)
              .map((post) => (
                <div
                  key={post.id}
                  onClick={() => copyPostCaption(post)}
                  className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group cursor-pointer border border-slate-200/60"
                  title="Cliquer pour copier la légende"
                >
                  <img
                    src={post.mediaUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                    <p className="text-[10px] font-bold line-clamp-2">{post.hook}</p>
                    <span className="mt-2 text-[9px] bg-white text-slate-900 font-semibold px-2 py-0.5 rounded-full">
                      Cliquer pour copier
                    </span>
                  </div>
                  <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-sm backdrop-blur-xs font-medium">
                    {post.date.split('-').slice(1).join('/')}
                  </div>
                </div>
              ))}
          </div>

          <p className="text-center text-xs text-slate-700 mt-6">
            💡 Astuce esthétique : alternez les photos produits rapprochées, les vidéos coulisses (Reels) et les citations/avis clients pour un feed harmonieux.
          </p>
        </div>
      )}
    </div>
  );
};
