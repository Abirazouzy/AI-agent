import { BrandProfile, SupportedLanguage, PlatformType, SocialPost } from '../types';

export interface GeneratePostParams {
  brand: BrandProfile;
  taskType?: 'post' | 'reels_hook' | 'carousel' | 'promo';
  prompt?: string;
  language: SupportedLanguage;
  platform: PlatformType;
}

export interface GeneratedPostResult {
  title: string;
  hook: string;
  caption: string;
  hashtags: string[];
  visualPrompt: string;
  callToAction: string;
  bestTime: string;
  storyIdea?: string;
}

export async function generateSocialPost(params: GeneratePostParams): Promise<GeneratedPostResult> {
  try {
    const res = await fetch('/api/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.error || 'Failed to generate post');
  } catch (err) {
    console.warn('Backend call failed, using client-side fallback generation:', err);
    // Client-side intelligent fallback based on parameters
    const { brand, language, platform } = params;
    const isEn = language === 'en';
    const isTn = language === 'tn';

    return {
      title: isEn ? `Spotlight: ${brand.name}` : `Coup de projecteur : ${brand.name}`,
      hook: isEn
        ? `✨ What makes ${brand.name} truly one-of-a-kind? Take a look inside.`
        : isTn
        ? `🔥 Chofou el khedma el ndhifa w el qualité chez ${brand.name} !`
        : `✨ Ce qui rend ${brand.name} si exceptionnel ? Regardez de plus près.`,
      caption: isEn
        ? `Crafted with love, passion, and uncompromising quality.\n\nEvery piece in our collection is created to bring timeless charm into your daily routine. Designed for those who value authenticity.\n\n📦 In stock & ready for quick delivery!\n💬 Drop a comment or message us to order yours.`
        : isTn
        ? `Kol pièce makhdouma b barcha 7ob w dkouwa fi tounes ! Qualité top w finition luxe.\n\n🛵 Fama livraison express 24-48h fi les 24 gouvernorats w khlas à la livraison !\n📩 Ab3athna message privé wela 3al WhatsApp bch tcommander.`
        : `L'art du détail et de l'authenticité chez ${brand.name}.\n\nChaque création est pensée pour vous accompagner avec élégance et durabilité. Façonné avec soin pour sublimer votre quotidien.\n\n🚚 Livraison rapide assurée dans toute la Tunisie (24-48h) & paiement à la livraison !\n👇 Dites-nous en commentaire votre modèle préféré ou écrivez-nous en DM.`,
      hashtags: [
        brand.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
        'artisanat',
        'tunisie',
        'madeintunisia',
        'shoplocal',
        'smallbusinesstn',
        'artisanattunisien',
        platform,
      ],
      visualPrompt:
        'Warm natural sunlight, 45-degree angle showcasing fine textures, artisanal wooden background, crisp focus and aesthetic styling.',
      callToAction: isEn
        ? 'DM us or message our WhatsApp to claim yours today!'
        : 'Écrivez-nous en message privé ou sur WhatsApp pour passer commande !',
      bestTime: '19:30 - 21:30 (Peak social traffic in Tunisia & North Africa)',
      storyIdea: 'Post a poll with 2 color variants asking your audience which one they prefer.',
    };
  }
}

export async function generateSmartReply(
  brand: BrandProfile,
  customerMessage: string,
  platform: PlatformType = 'instagram'
) {
  try {
    const res = await fetch('/api/smart-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand, customerMessage, platform }),
    });

    if (!res.ok) throw new Error('Reply generation error');
    const data = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.error || 'Failed to generate reply');
  } catch (err) {
    console.warn('Using client-side fallback reply:', err);
    const firstProduct = brand.products[0];
    const priceText = firstProduct ? `${firstProduct.price} ${brand.currency}` : `sur demande`;

    return {
      detectedIntent: 'Demande de tarif et de disponibilité',
      matchedProduct: firstProduct?.name || 'Produit de la collection',
      suggestedAnswers: {
        direct: `Bonjour ! Merci beaucoup pour votre message. Le prix est de ${priceText}. L'article est bien disponible en stock ! Nous assurons la livraison sous 24-48h partout en Tunisie (7 TND) avec paiement à la livraison.`,
        converting: `Bonjour et merci pour votre intérêt ! ✨ Cet article est à ${priceText}. Chaque modèle est préparé avec le plus grand soin dans notre atelier. Si vous commandez maintenant, votre colis partira dès demain matin ! Quelle est votre ville de livraison ?`,
        derja_friendly: `Ahla bik ! Marhba 🥰 Le prix est de ${priceText}. Mawjoud en stock w fama livraison rapide fi tounes l kol (24-48h) w khlas à la livraison. Ken t7eb tcommander ab3athelna adresse w numéro mte3ek !`,
      },
      salesTip: 'Proposez de prendre les coordonnées immédiatement pour valider la livraison sans friction.',
    };
  }
}

export async function sendAgentChatMessage(
  brand: BrandProfile,
  messages: { role: 'user' | 'model'; content: string }[],
  language: SupportedLanguage = 'fr'
): Promise<string> {
  try {
    const res = await fetch('/api/chat-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand, messages, language }),
    });

    if (!res.ok) throw new Error('Agent chat error');
    const data = await res.json();
    if (data.success && data.reply) {
      return data.reply;
    }
    throw new Error(data.error || 'Failed to chat with agent');
  } catch (err) {
    console.warn('Using fallback chat response:', err);
    return `Bonjour ! Je suis **Amira**, votre copilote réseaux sociaux pour **${brand.name}**.\n\nJe suis là pour vous aider à booster vos ventes et votre visibilité !\n\nVoici ce que nous pouvons faire tout de suite :\n1. **Générer 5 idées de Reels viraux** avec les hooks qui cartonnent en ce moment.\n2. **Rédiger un post promotionnel** avec un appel à l'action irrésistible vers votre WhatsApp.\n3. **Planifier votre calendrier de publication** pour la semaine entière.\n\nQue préférez-vous lancer en priorité ?`;
  }
}

export async function generateAutoCalendar(
  brand: BrandProfile,
  goal: string = 'grow_engagement',
  language: SupportedLanguage = 'fr'
): Promise<SocialPost[]> {
  try {
    const res = await fetch('/api/generate-calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand, goal, language }),
    });

    if (!res.ok) throw new Error('Calendar generation error');
    const data = await res.json();
    if (data.success && Array.isArray(data.calendar)) {
      // Map to SocialPost format
      const today = new Date();
      return data.calendar.map((item: any, idx: number) => {
        const postDate = new Date(today);
        postDate.setDate(today.getDate() + idx + 1);
        const dateStr = postDate.toISOString().split('T')[0];

        return {
          id: `gen-post-${Date.now()}-${idx}`,
          title: `${item.pillar || 'Post'} - ${item.day || `Jour ${idx + 1}`}`,
          platform: item.platform || 'instagram',
          date: dateStr,
          time: item.time || '19:30',
          status: 'scheduled' as const,
          hook: item.hook || 'Nouveau post pour notre communauté !',
          caption: item.caption || 'Découvrez nos nouveautés artisanales dès aujourd\'hui.',
          hashtags: item.hashtags || ['tunisia', 'smallbusiness', 'shoplocal'],
          mediaType: (item.mediaType || 'photo') as any,
          mediaUrl: brand.products[idx % brand.products.length]?.imageUrl || brand.products[0]?.imageUrl,
          pillar: item.pillar || 'Content',
          callToAction: 'Envoyez un DM ou WhatsApp pour commander !',
          visualPrompt: item.visualIdea || 'Photo soignée du produit sous lumière naturelle.',
        };
      });
    }
    throw new Error('Invalid calendar response');
  } catch (err) {
    console.warn('Fallback calendar generation:', err);
    const today = new Date();
    return [
      {
        id: `cal-1-${Date.now()}`,
        title: 'Coup de cœur du Lundi',
        platform: 'instagram',
        date: new Date(today.getTime() + 86400000).toISOString().split('T')[0],
        time: '12:30',
        status: 'scheduled',
        hook: `✨ Commencez la semaine avec notre best-seller chez ${brand.name} !`,
        caption: `Chaque semaine apporte son lot de créativité. Nos pièces sont pensées pour embellir votre quotidien avec authenticité.\n\n📍 Livraison rapide sur toute la Tunisie (24-48h).\n👉 Commentez PRIX ou envoyez un DM pour commander.`,
        hashtags: ['newweek', 'tunisianbrand', 'shoplocal', 'quality'],
        mediaType: 'photo',
        mediaUrl: brand.products[0]?.imageUrl,
        pillar: 'Product Spotlight',
        callToAction: 'Commentez PRIX pour recevoir les détails en DM.',
      },
      {
        id: `cal-2-${Date.now()}`,
        title: 'Coulisses de fabrication',
        platform: 'tiktok',
        date: new Date(today.getTime() + 86400000 * 2).toISOString().split('T')[0],
        time: '20:00',
        status: 'scheduled',
        hook: `Ce geste artisanal que vous ne voyez jamais en boutique... 👐`,
        caption: `On vous emmène dans les coulisses aujourd'hui ! Des heures de patience et d'amour pour chaque création. Merci pour tout votre soutien au quotidien ❤️`,
        hashtags: ['behindthescenes', 'tiktoktunisie', 'handmade', 'artisanat'],
        mediaType: 'reel',
        mediaUrl: brand.products[1]?.imageUrl || brand.products[0]?.imageUrl,
        pillar: 'Behind The Scenes',
        callToAction: 'Abonnez-vous pour voir l\'étape suivante demain !',
      },
      {
        id: `cal-3-${Date.now()}`,
        title: 'Offre Express Milieu de Semaine',
        platform: 'facebook',
        date: new Date(today.getTime() + 86400000 * 3).toISOString().split('T')[0],
        time: '14:15',
        status: 'scheduled',
        hook: `🎉 Livraison gratuite dès 2 articles commandés jusqu'à ce soir !`,
        caption: `Faites-vous plaisir ou gâtez un proche sans frais supplémentaires. Nos stocks partent vite, ne tardez pas à réserver vos articles préférés !`,
        hashtags: ['bonsplanstn', 'livraisongratuite', 'tunisie', 'promo'],
        mediaType: 'photo',
        mediaUrl: brand.products[2]?.imageUrl || brand.products[0]?.imageUrl,
        pillar: 'Direct Offer',
        callToAction: 'Contactez notre WhatsApp pour réserver votre pack.',
      },
    ];
  }
}

export interface GenerateImageParams {
  prompt: string;
  brand: BrandProfile;
  style?: 'studio' | 'mediterranean' | 'lifestyle' | 'editorial';
  aspectRatio?: '1:1' | '4:5' | '9:16' | '16:9';
  postDescription?: string;
}

export interface GeneratedImageResponse {
  imageUrl: string;
  promptUsed: string;
  style: string;
  aspectRatio: string;
}

export async function generatePostImage(params: GenerateImageParams): Promise<GeneratedImageResponse> {
  try {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) throw new Error(`Image API returned ${res.status}`);
    const data = await res.json();
    if (data.success && data.imageUrl) {
      return data;
    }
    throw new Error(data.error || 'Failed to generate image');
  } catch (err) {
    console.warn('Backend image generation failed, using intelligent client fallback:', err);
    // Intelligent client-side fallback
    const { brand, prompt, postDescription } = params;
    const lower = `${prompt || ''} ${postDescription || ''} ${brand?.name || ''}`.toLowerCase();
    
    let fallbackImg = '/images/dar_medina_ceramic_plate_1790159538696.jpg';
    if (lower.includes('bol') || lower.includes('terracotta') || lower.includes('tajine') || lower.includes('pot')) {
      fallbackImg = '/images/dar_medina_terracotta_bowls_1790159551971.jpg';
    } else if (lower.includes('huile') || lower.includes('serum') || lower.includes('bio') || lower.includes('soin') || lower.includes('cosmetique')) {
      fallbackImg = '/images/maison_yasmine_serum_1790159563716.jpg';
    } else if (lower.includes('hoodie') || lower.includes('mode') || lower.includes('streetwear') || lower.includes('coton') || lower.includes('vetement')) {
      fallbackImg = '/images/nomad_threads_hoodie_1790159575837.jpg';
    } else if (brand.products?.[0]?.imageUrl) {
      fallbackImg = brand.products[0].imageUrl;
    }

    return {
      imageUrl: fallbackImg,
      promptUsed: prompt || postDescription || brand.name,
      style: params.style || 'studio',
      aspectRatio: params.aspectRatio || '1:1',
    };
  }
}
