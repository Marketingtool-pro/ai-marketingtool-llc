import { create } from 'zustand';
import { Models } from 'react-native-appwrite';
import { dbService, COLLECTIONS, Query } from '../services/appwrite';
import { generateAIContent } from '../services/aiService';

export interface Tool {
  $id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  category: string;
  subcategory?: string;
  isPro: boolean;
  inputs: ToolInput[];
  outputType: 'text' | 'image' | 'code' | 'html';
  exampleOutput?: string;
  tags: string[];
}

export interface ToolInput {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'toggle';
  placeholder?: string;
  required: boolean;
  options?: string[];
  defaultValue?: string | number | boolean;
  maxLength?: number;
  helperText?: string;
}

export interface Generation {
  $id: string;
  userId: string;
  toolId: string;
  toolName: string;
  input: Record<string, any>;
  output: string;
  outputType: 'text' | 'image' | 'code' | 'html';
  createdAt: string;
  isFavorite: boolean;
}

interface ToolsState {
  tools: Tool[];
  categories: string[];
  recentTools: Tool[];
  favoriteTools: Tool[];
  generations: Generation[];
  selectedTool: Tool | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;

  // Actions
  fetchTools: () => Promise<void>;
  fetchToolBySlug: (slug: string) => Promise<Tool | null>;
  fetchGenerations: (userId: string) => Promise<void>;
  addGeneration: (generation: Omit<Generation, '$id'>) => Promise<void>;
  toggleFavorite: (generationId: string) => Promise<void>;
  setSelectedTool: (tool: Tool | null) => void;
  searchTools: (query: string) => Tool[];
  getToolsByCategory: (category: string) => Tool[];
  generateContent: (toolId: string, inputs: Record<string, any>) => Promise<any>;
  deleteGeneration: (generationId: string) => Promise<void>;
}

// 3 Main Platforms
export const PLATFORMS = [
  { id: 'google', name: 'Google Ads', icon: 'search', color: '#4285F4' },
  { id: 'meta', name: 'Meta/Facebook', icon: 'facebook', color: '#1877F2' },
  { id: 'shopify', name: 'Shopify/E-commerce', icon: 'shopping-bag', color: '#96BF48' },
];

// AI Tool Categories (matching web app)
export const TOOL_CATEGORIES = [
  // Google Platform Categories
  { id: 'google-ads', name: 'Google Ads', icon: 'target', platform: 'google' },
  { id: 'google-seo', name: 'Google SEO', icon: 'search', platform: 'google' },
  { id: 'google-analytics', name: 'Analytics', icon: 'bar-chart-2', platform: 'google' },
  { id: 'google-content', name: 'Content & Blogs', icon: 'file-text', platform: 'google' },
  // Meta/Facebook Platform Categories
  { id: 'facebook-ads', name: 'Facebook Ads', icon: 'target', platform: 'meta' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', platform: 'meta' },
  { id: 'social-media', name: 'Social Media', icon: 'share-2', platform: 'meta' },
  { id: 'meta-content', name: 'Content Creator', icon: 'edit-3', platform: 'meta' },
  // Shopify/E-commerce Platform Categories
  { id: 'shopify-products', name: 'Product Listings', icon: 'shopping-bag', platform: 'shopify' },
  { id: 'shopify-ads', name: 'Shopping Ads', icon: 'target', platform: 'shopify' },
  { id: 'email-marketing', name: 'Email Marketing', icon: 'mail', platform: 'shopify' },
  { id: 'ecommerce-seo', name: 'E-commerce SEO', icon: 'search', platform: 'shopify' },
  // TikTok
  { id: 'tiktok', name: 'TikTok', icon: 'video', platform: 'meta' },
  // YouTube
  { id: 'youtube', name: 'YouTube', icon: 'youtube', platform: 'meta' },
  // LinkedIn
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', platform: 'meta' },
  // Twitter/X
  { id: 'twitter', name: 'Twitter/X', icon: 'twitter', platform: 'meta' },
  // Pinterest
  { id: 'pinterest', name: 'Pinterest', icon: 'image', platform: 'meta' },
  // AI Marketing Agents (All Platforms)
  { id: 'ai-agents', name: 'AI Marketing Agents', icon: 'cpu', platform: 'all' },
  // Content Creation Tools
  { id: 'content-creation', name: 'Content Creation', icon: 'edit', platform: 'all' },
  // Copywriting Tools
  { id: 'copywriting', name: 'Copywriting', icon: 'edit-3', platform: 'all' },
];


// Load ALL 314 tools from tools.js (was tools.json — renamed to bypass *.json archive filter)
const allToolsRaw = require('../data/tools.js');
import { ToolIconImagesKeys, setToolIconOverride, getToolIcon as _getToolIcon } from '../constants/toolIcons';

// Pro lock derivation — basic single-shot content tools stay free so users
// can taste the catalog; everything advanced (analytics, audits, AI agents,
// schemas, multi-step generators, optimizers) requires a paid plan.
// Tuned against the actual 314-tool catalog: ~12 free, ~302 pro.
const FREE_KEYWORDS = ['caption', 'hashtag', 'meme', 'tagline', 'slogan', 'subject-line', 'quote-image'];
const FREE_EXACT_SLUGS = new Set([
  'blog-post-ideas',
  'instagram-bio',
  'instagram-bio-optimizer',
  'seo-title-generator',
  'youtube-title-generator',
  'meta-description-generator',
  'product-description-writer',
  'youtube-description-generator',
  'review-response',
  'viral-tweet',
  'viral-tweets',
  'social-bio-writer',
]);
function deriveIsPro(slug: any): boolean {
  if (typeof slug !== 'string') return true;
  const s = slug.toLowerCase();
  if (FREE_EXACT_SLUGS.has(s)) return false;
  return !FREE_KEYWORDS.some((k) => s.includes(k));
}

// Build 448's exact icon assignment — restored to match TestFlight 448 1:1.
function assignUniqueIcons(slugs: string[]) {
  const pool = ToolIconImagesKeys;
  const meaningful = pool.filter(k => /[a-z]{3,}/.test(k) && !/^\d+(-[a-z])?$/.test(k));
  const used = new Set<string>();

  const sorted = [...slugs].sort();

  for (const slug of sorted) {
    const slugWords = slug.split('-').filter(w => w.length > 2);
    let chosen: string | null = null;

    for (const word of slugWords) {
      const candidate = meaningful.find(k => !used.has(k) && k.includes(word));
      if (candidate) { chosen = candidate; break; }
    }

    if (!chosen) chosen = meaningful.find(k => !used.has(k)) || null;

    if (!chosen) chosen = pool.find(k => !used.has(k)) || pool[0];

    used.add(chosen!);
    setToolIconOverride(slug, _getToolIcon(chosen!));
  }
}

function badgeToCategory(badge: string, name: string): string {
  const b = (badge || '').toLowerCase();
  const n = (name || '').toLowerCase();
  // Instagram MUST be checked BEFORE Meta — Instagram tools have their own page in web app
  if (b === 'instagram' || n.includes('instagram')) return 'instagram';
  if (b === 'tiktok' || n.includes('tiktok')) return 'tiktok';
  if (b === 'youtube' || n.includes('youtube')) return 'youtube';
  if (b === 'linkedin' || n.includes('linkedin')) return 'linkedin';
  if (b === 'twitter/x' || n.includes('twitter')) return 'twitter';
  if (b === 'pinterest' || n.includes('pinterest')) return 'pinterest';
  if (b === 'social media') return 'social-media';
  // Meta / Facebook only — Instagram already routed above
  if (b === 'facebook/meta' || n.includes('facebook') || n.includes('meta ')) return 'facebook-ads';
  // Google Ads page (web) includes these badges
  if (b === 'google ads' || b === 'campaign' || b === 'budget' || b === 'ppc optimization' ||
      b === 'audit' || b === 'grader' ||
      n.includes('google ad') || n.includes('ppc') || n.includes('keyword') ||
      n.includes('quality score')) return 'google-ads';
  if (b === 'shopify' || n.includes('shopify')) return 'shopify-products';
  if (b === 'e-commerce') return 'shopify-products';
  if (b === 'seo') return 'google-seo';
  if (b === 'content writing' || b === 'copywriting' || b === 'text editing') return 'content-creation';
  if (b === 'analytics' || b === 'roi & attribution') return 'google-analytics';
  if (b === 'email') return 'email-marketing';
  // AI Tools page bucket: AI Agent + Marketing + Advertising + Branding + Developer + Automation + Schema + Education
  if (b === 'ai agent' || b === 'automation' || b === 'marketing' || b === 'advertising' ||
      b === 'branding' || b === 'developer' || b === 'schema' || b === 'education') return 'ai-agents';
  return 'ai-agents';
}

// Canonical source of truth: tools.json (mirrors the web app's 314-tool catalog).
// No hardcoded sample arrays, no fake usage/rating/trending metadata.
const ALL_TOOLS: Tool[] = (allToolsRaw as any[]).map((t, i) => ({
  $id: `t${i}`,
  name: t.name || 'Tool',
  slug: t.slug || `tool-${i}`,
  shortDescription: t.description?.slice(0, 80) || '',
  description: t.description || '',
  icon: 'zap',
  category: badgeToCategory(t.badge, t.name),
  isPro: t.isPro === false ? false : deriveIsPro(t.slug),
  inputs: t.formFields || [{ name: 'mainInput', label: 'Input', type: 'textarea', required: true }],
  outputType: 'text',
  tags: [t.badge].filter(Boolean),
})) as Tool[];

// Assign every tool a UNIQUE paid icon from the 336-icon pool
assignUniqueIcons(ALL_TOOLS.map(t => t.slug));

export const useToolsStore = create<ToolsState>((set, get) => ({
  tools: ALL_TOOLS,
  categories: TOOL_CATEGORIES.map(c => c.id),
  recentTools: [],
  favoriteTools: [],
  generations: [],
  selectedTool: null,
  isLoading: false,
  isGenerating: false,
  error: null,

  fetchTools: async () => {
    set({ isLoading: true });
    try {
      set({ tools: ALL_TOOLS, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchToolBySlug: async (slug: string) => {
    const tool = get().tools.find(t => t.slug === slug);
    if (tool) {
      set({ selectedTool: tool });
      return tool;
    }
    return null;
  },

  fetchGenerations: async (userId: string) => {
    set({ isLoading: true });
    try {
      const result = await dbService.listDocuments<Generation & Models.Document>(
        COLLECTIONS.GENERATIONS,
        [Query.equal('userId', userId), Query.orderDesc('createdAt'), Query.limit(50)]
      );
      set({ generations: result.documents as Generation[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addGeneration: async (generation: Omit<Generation, '$id'>) => {
    try {
      const newGen = await dbService.createDocument<Generation & Models.Document>(
        COLLECTIONS.GENERATIONS,
        generation
      );
      set(state => ({
        generations: [newGen as Generation, ...state.generations],
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  toggleFavorite: async (generationId: string) => {
    const generation = get().generations.find(g => g.$id === generationId);
    if (!generation) return;

    try {
      await dbService.updateDocument(COLLECTIONS.GENERATIONS, generationId, {
        isFavorite: !generation.isFavorite,
      });
      set(state => ({
        generations: state.generations.map(g =>
          g.$id === generationId ? { ...g, isFavorite: !g.isFavorite } : g
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteGeneration: async (generationId: string) => {
    try {
      await dbService.deleteDocument(COLLECTIONS.GENERATIONS, generationId);
      set(state => ({
        generations: state.generations.filter(g => g.$id !== generationId),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  setSelectedTool: (tool: Tool | null) => set({ selectedTool: tool }),

  searchTools: (query: string) => {
    const lowerQuery = query.toLowerCase();
    return get().tools.filter(
      t =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery) ||
        t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },

  getToolsByCategory: (category: string) => {
    return get().tools.filter(t => t.category === category);
  },

  generateContent: async (toolId: string, inputs: Record<string, any>) => {
    set({ isGenerating: true, error: null });
    try {
      const tool = get().tools.find(t => t.$id === toolId);
      if (!tool) {
        throw new Error('Tool not found');
      }

      const outputCount = inputs.outputCount || 3;

      // Call REAL AI service - no mock, no sample
      const result = await generateAIContent({
        toolSlug: tool.slug,
        toolName: tool.name,
        inputs,
        tone: inputs.tone,
        language: inputs.language,
        outputCount,
      });

      if (!result.success || result.outputs.length === 0) {
        throw new Error(result.error || 'Failed to generate content');
      }

      set({ isGenerating: false });

      return {
        toolId,
        outputs: result.outputs,
        createdAt: new Date().toISOString(),
        tokensUsed: result.tokensUsed,
      };
    } catch (error: any) {
      set({ isGenerating: false, error: error.message });
      throw error;
    }
  },
}));

export default useToolsStore;
