/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrandProfile, SocialPost, CustomerInquiry, SupportedLanguage } from './types';
import { DEFAULT_BUSINESSES, INITIAL_POSTS, INITIAL_INQUIRIES } from './data/defaultBusinesses';
import { Header } from './components/Header';
import { Navigation, NavigationTab } from './components/Navigation';
import { CopilotTab } from './components/CopilotTab';
import { SchedulerTab } from './components/SchedulerTab';
import { InboxTab } from './components/InboxTab';
import { CatalogTab } from './components/CatalogTab';
import { PlaybookTab } from './components/PlaybookTab';
import { NewPostModal } from './components/NewPostModal';
import { BusinessModal } from './components/BusinessModal';

export default function App() {
  // Brands state
  const [brands, setBrands] = useState<BrandProfile[]>(() => {
    const saved = localStorage.getItem('el_agent_brands');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_BUSINESSES;
  });

  const [currentBrandId, setCurrentBrandId] = useState<string>(() => {
    return localStorage.getItem('el_agent_current_brand') || DEFAULT_BUSINESSES[0].id;
  });

  // Language state: 'fr' (French), 'en' (English), or 'tn' (Franco-Tunisien)
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('el_agent_lang') as SupportedLanguage) || 'fr';
  });

  // Posts state
  const [posts, setPosts] = useState<SocialPost[]>(() => {
    const saved = localStorage.getItem('el_agent_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_POSTS;
  });

  // Customer Inquiries state
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    const saved = localStorage.getItem('el_agent_inquiries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_INQUIRIES;
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('copilot');

  // Modals state
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [modalInitialPost, setModalInitialPost] = useState<Partial<SocialPost> | undefined>(undefined);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);

  const handleOpenNewPost = (draft?: Partial<SocialPost>) => {
    setModalInitialPost(draft);
    setIsNewPostModalOpen(true);
  };

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('el_agent_brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('el_agent_current_brand', currentBrandId);
  }, [currentBrandId]);

  useEffect(() => {
    localStorage.setItem('el_agent_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('el_agent_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('el_agent_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  const currentBrand = brands.find((b) => b.id === currentBrandId) || brands[0];

  // Post action handlers
  const handleSavePost = (newPost: SocialPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleUpdatePost = (updatedPost: SocialPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleBulkAddPosts = (newPosts: SocialPost[]) => {
    setPosts((prev) => [...newPosts, ...prev]);
  };

  // Inquiry action handlers
  const handleUpdateInquiry = (updatedInquiry: CustomerInquiry) => {
    setInquiries((prev) => prev.map((i) => (i.id === updatedInquiry.id ? updatedInquiry : i)));
  };

  const handleAddInquiry = (newInquiry: CustomerInquiry) => {
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  // Brand action handlers
  const handleUpdateBrand = (updatedBrand: BrandProfile) => {
    setBrands((prev) => prev.map((b) => (b.id === updatedBrand.id ? updatedBrand : b)));
  };

  const handleAddBrand = (newBrand: BrandProfile) => {
    setBrands((prev) => [...prev, newBrand]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentBrand={currentBrand}
        allBrands={brands}
        onSelectBrand={(b) => setCurrentBrandId(b.id)}
        language={language}
        onLanguageChange={setLanguage}
        onOpenNewPost={() => handleOpenNewPost()}
        onOpenBusinessModal={() => setIsBusinessModalOpen(true)}
      />

      {/* Main Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        scheduledCount={posts.filter((p) => p.status === 'scheduled').length}
        pendingInquiriesCount={inquiries.filter((i) => i.status === 'pending').length}
        productsCount={currentBrand.products.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'copilot' && (
          <CopilotTab
            brand={currentBrand}
            language={language}
            onOpenImageStudio={(draft) => handleOpenNewPost(draft)}
            onAddPostToSchedule={(partialPost) => {
              const fullPost: SocialPost = {
                id: `post-${Date.now()}`,
                title: partialPost.title || 'Post suggéré par Amira',
                platform: partialPost.platform || 'instagram',
                date: partialPost.date || new Date().toISOString().split('T')[0],
                time: partialPost.time || '19:30',
                status: 'scheduled',
                hook: partialPost.hook || 'Découvrez notre nouveauté !',
                caption: partialPost.caption || '',
                hashtags: partialPost.hashtags || ['artisanat', 'tunisie', 'shoplocal'],
                mediaType: partialPost.mediaType || 'photo',
                mediaUrl: partialPost.mediaUrl || currentBrand.products[0]?.imageUrl,
                pillar: partialPost.pillar || 'Content',
                callToAction: partialPost.callToAction || 'Envoyez un message pour commander.',
              };
              handleSavePost(fullPost);
              setActiveTab('scheduler');
            }}
          />
        )}

        {activeTab === 'scheduler' && (
          <SchedulerTab
            posts={posts}
            brand={currentBrand}
            language={language}
            onOpenNewPost={() => handleOpenNewPost()}
            onUpdatePost={handleUpdatePost}
            onDeletePost={handleDeletePost}
            onBulkAddPosts={handleBulkAddPosts}
          />
        )}

        {activeTab === 'inbox' && (
          <InboxTab
            inquiries={inquiries}
            brand={currentBrand}
            language={language}
            onUpdateInquiry={handleUpdateInquiry}
            onAddInquiry={handleAddInquiry}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogTab
            brand={currentBrand}
            language={language}
            onUpdateBrand={handleUpdateBrand}
          />
        )}

        {activeTab === 'playbook' && (
          <PlaybookTab brand={currentBrand} language={language} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-700">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <span className="font-bold text-slate-800">El-Agent AI</span> — Copilote réseaux sociaux bilingue (Français, Anglais, Franco-Tunisien)
          </p>
          <p className="text-slate-600">
            Conçu pour les petites entreprises en Tunisie et dans le monde entier • Propulsé par Gemini 3.8 Flash
          </p>
        </div>
      </footer>

      {/* New Post Modal */}
      {isNewPostModalOpen && (
        <NewPostModal
          brand={currentBrand}
          language={language}
          isOpen={isNewPostModalOpen}
          initialPost={modalInitialPost}
          onClose={() => {
            setIsNewPostModalOpen(false);
            setModalInitialPost(undefined);
          }}
          onSavePost={handleSavePost}
        />
      )}

      {/* Business Switcher / Creator Modal */}
      {isBusinessModalOpen && (
        <BusinessModal
          isOpen={isBusinessModalOpen}
          onClose={() => setIsBusinessModalOpen(false)}
          currentBrand={currentBrand}
          allBrands={brands}
          onSelectBrand={(b) => setCurrentBrandId(b.id)}
          onAddBrand={handleAddBrand}
        />
      )}
    </div>
  );
}
