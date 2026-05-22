import { create } from 'zustand';
import { dbService, COLLECTIONS, Query, client, DATABASE_ID } from '../services/appwrite';
import { Models } from 'react-native-appwrite';
import { useAuthStore } from './authStore';

export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

export interface PerformanceDataPoint {
  date: string;
  value: number;
}

export interface RecentActivity {
  id: string;
  type: 'generation' | 'favorite' | 'login' | 'subscription';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export type DateRange = '7d' | '30d' | 'all';

interface DashboardState {
  metrics: DashboardMetric[];
  performanceData: PerformanceDataPoint[];
  recentActivities: RecentActivity[];
  dateRange: DateRange;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDashboardData: (userId: string) => Promise<void>;
  setupRealtimeListeners: (userId: string) => () => void;
  setDateRange: (range: DateRange) => void;
  setMetrics: (metrics: DashboardMetric[]) => void;
  setPerformanceData: (data: PerformanceDataPoint[]) => void;
  setRecentActivities: (activities: RecentActivity[]) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  metrics: [],
  performanceData: [],
  recentActivities: [],
  dateRange: '7d',
  isLoading: false,
  error: null,

  setDateRange: (dateRange) => {
    set({ dateRange });
    const { user } = useAuthStore.getState();
    if (user?.$id) {
      get().fetchDashboardData(user.$id);
    }
  },

  setMetrics: (metrics) => set({ metrics }),
  setPerformanceData: (performanceData) => set({ performanceData }),
  setRecentActivities: (recentActivities) => set({ recentActivities }),

  fetchDashboardData: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Fetch Generations for basic metrics (for now)
      const generationsResult = await dbService.listDocuments(
        COLLECTIONS.GENERATIONS,
        [Query.equal('userId', userId), Query.orderDesc('createdAt'), Query.limit(100)]
      );

      const generations = generationsResult.documents;
      const totalGenerations = generations.length;

      const favoritesCount = generations.filter((g: any) => g.isFavorite === true).length;
      const uniqueTools = new Set(generations.map((g: any) => g.toolId).filter(Boolean)).size;
      const totalTokens = generations.reduce((sum: number, g: any) => sum + (Number(g.tokensUsed) || 0), 0);

      const metrics: DashboardMetric[] = [
        { id: 'gen', label: 'AI Generations', value: totalGenerations, change: 0, trend: 'neutral', icon: 'zap', color: '#E4405F' },
        { id: 'tools', label: 'Tools Used', value: uniqueTools, change: 0, trend: 'neutral', icon: 'grid', color: '#4285F4' },
        { id: 'favs', label: 'Saved', value: favoritesCount, change: 0, trend: 'neutral', icon: 'bookmark', color: '#96BF48' },
        { id: 'tokens', label: 'Tokens Used', value: totalTokens.toLocaleString(), change: 0, trend: 'neutral', icon: 'activity', color: '#1877F2' },
      ];

      const performanceData: PerformanceDataPoint[] = [];
      const now = new Date();
      const { dateRange } = get();
      const daysToShow = dateRange === '30d' ? 30 : dateRange === 'all' ? 90 : 7;
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const count = generations.filter((g: any) => typeof g.createdAt === 'string' && g.createdAt.startsWith(dateStr)).length;
        performanceData.push({ date: dateStr, value: count });
      }

      // 3. Recent Activities
      const recentActivities: RecentActivity[] = generations.slice(0, 10).map((g: any) => ({
        id: g.$id,
        type: 'generation',
        title: g.toolName,
        description: `Generated ${g.outputType} content`,
        timestamp: g.createdAt,
        metadata: { toolId: g.toolId }
      }));

      set({ 
        metrics, 
        performanceData, 
        recentActivities, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setupRealtimeListeners: (userId: string) => {
    // Appwrite Realtime listener for generations
    const channel = `databases.${DATABASE_ID}.collections.${COLLECTIONS.GENERATIONS}.documents`;
    
    const unsubscribe = client.subscribe(channel, (response) => {
      // If a new generation is created for this user, refresh data
      const payload = response.payload as any;
      if (payload.userId === userId) {
        get().fetchDashboardData(userId);
      }
    });

    return unsubscribe;
  },
}));
