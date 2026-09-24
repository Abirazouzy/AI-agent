export type SupportedLanguage = 'fr' | 'en' | 'tn';

export type PlatformType = 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'whatsapp';

export type MediaType = 'photo' | 'carousel' | 'reel' | 'story';

export type PostStatus = 'draft' | 'scheduled' | 'published';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl?: string;
  inStock: boolean;
  tag?: string;
}

export interface BrandProfile {
  id: string;
  name: string;
  tagline: string;
  niche: string;
  location: string;
  currency: string;
  tone: string;
  targetAudience: string;
  deliveryInfo: string;
  story: string;
  instagramHandle: string;
  facebookPage: string;
  tiktokHandle?: string;
  whatsappNumber: string;
  accentColor: string;
  products: Product[];
}

export interface SocialPost {
  id: string;
  title: string;
  platform: PlatformType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: PostStatus;
  hook: string;
  caption: string;
  hashtags: string[];
  mediaType: MediaType;
  mediaUrl?: string;
  pillar: string;
  callToAction: string;
  visualPrompt?: string;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
}

export interface CustomerInquiry {
  id: string;
  customerName: string;
  avatar: string;
  platform: PlatformType;
  timestamp: string;
  message: string;
  detectedIntent: string;
  productMentioned?: string;
  status: 'pending' | 'replied' | 'converted';
  aiReplies: {
    direct: string;
    converting: string;
    derja_friendly: string;
  };
  selectedReply?: string;
  salesTip?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: string;
  postDraft?: Partial<SocialPost>;
  actionButtons?: {
    label: string;
    action: string;
  }[];
}
