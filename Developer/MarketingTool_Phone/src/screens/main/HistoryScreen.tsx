import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SectionList,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useToolsStore, Generation } from '../../store/toolsStore';
import { useAuthStore } from '../../store/authStore';
import { Colors, Gradients, Spacing, BorderRadius } from '../../constants/theme';


const { width } = Dimensions.get('window');

// History hero image
const HistoryHeroImage = require('../../../assets/images/screens/history-hero.webp');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Section {
  title: string;
  data: Generation[];
}

// Map tool category to display filter
const getCategoryDisplay = (category: string): string => {
  if (category.includes('ads') || category.includes('ppc')) return 'Ads';
  if (category.includes('content') || category.includes('blog') || category.includes('seo')) return 'Content';
  if (category.includes('email')) return 'Email';
  if (category.includes('social') || category.includes('instagram')) return 'Social';
  if (category.includes('shopify') || category.includes('product') || category.includes('commerce')) return 'E-commerce';
  return 'Content';
};

// Group generations by date
const groupByDate = (items: Generation[]): Section[] => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const today: Generation[] = [];
  const yesterday: Generation[] = [];
  const earlier: Generation[] = [];

  items.forEach(item => {
    const date = new Date(item.createdAt);
    if (date >= todayStart) today.push(item);
    else if (date >= yesterdayStart) yesterday.push(item);
    else earlier.push(item);
  });

  const sections: Section[] = [];
  if (today.length) sections.push({ title: 'Today', data: today });
  if (yesterday.length) sections.push({ title: 'Yesterday', data: yesterday });
  if (earlier.length) sections.push({ title: 'Earlier', data: earlier });
  return sections;
};

const HistoryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { tools, generations, fetchGenerations, toggleFavorite, deleteGeneration } = useToolsStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filters = ['All', 'Ads', 'Content', 'Email', 'Social', 'E-commerce'];

  // Fetch real generations on mount
  useEffect(() => {
    if (user?.$id) {
      fetchGenerations(user.$id);
    }
  }, [user?.$id]);

  // Look up tool info for icon/category
  const getToolInfo = useCallback((toolId: string) => {
    const tool = tools.find(t => t.$id === toolId);
    return {
      icon: tool?.icon || 'zap',
      category: tool?.category ? getCategoryDisplay(tool.category) : 'Content',
    };
  }, [tools]);

  // Filter and group
  const sections = useMemo(() => {
    let items = [...generations];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        item =>
          item.output.toLowerCase().includes(q) ||
          item.toolName.toLowerCase().includes(q)
      );
    }

    if (selectedFilter && selectedFilter !== 'All') {
      items = items.filter(item => {
        const info = getToolInfo(item.toolId);
        return info.category === selectedFilter;
      });
    }

    // Sort newest first
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return groupByDate(items);
  }, [generations, searchQuery, selectedFilter, getToolInfo]);

  const totalCount = generations.length;
  const likedCount = generations.filter(g => g.isFavorite).length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleCopy = async (content: string, id: string) => {
    await Clipboard.setStringAsync(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLike = (id: string) => {
    toggleFavorite(id);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteGeneration(id),
        },
      ]
    );
  };

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Generation }) => {
    const toolInfo = getToolInfo(item.toolId);
    return (
      <View style={styles.historyCard}>
        <View style={styles.cardHeader}>
          <View style={styles.toolInfo}>
            <View style={[styles.toolIcon, { backgroundColor: Colors.secondary + '20' }]}>
              <Feather name={toolInfo.icon as any} size={18} color={Colors.secondary} />
            </View>
            <View>
              <Text style={styles.toolName}>{item.toolName}</Text>
              <Text style={styles.timeAgo}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{toolInfo.category}</Text>
          </View>
        </View>

        <Text style={styles.contentText} numberOfLines={3}>
          {item.output}
        </Text>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleCopy(item.output, item.$id)}
          >
            <Feather
              name={copiedId === item.$id ? 'check' : 'copy'}
              size={18}
              color={copiedId === item.$id ? Colors.success : Colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleLike(item.$id)}
          >
            <Feather
              name="heart"
              size={18}
              color={item.isFavorite ? Colors.error : Colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleDelete(item.$id)}
          >
            <Feather name="trash-2" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.expandBtn}
            onPress={() => {
              navigation.navigate('ToolResult', {
                result: item.output,
                toolSlug: item.toolId,
              } as any);
            }}
          >
            <Text style={styles.expandText}>View Full</Text>
            <Feather name="chevron-right" size={16} color={Colors.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screenContainer}>
      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Image source={HistoryHeroImage} style={styles.heroImage} resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(6, 11, 40, 0.8)', 'rgba(6, 11, 40, 0.98)']}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Generation History</Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStatItem}>
                <Feather name="layers" size={16} color={Colors.secondary} />
                <Text style={styles.heroStatText}>{totalCount} Saved</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Feather name="heart" size={16} color={Colors.error} />
                <Text style={styles.heroStatText}>{likedCount} Liked</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search history..."
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filters — always visible for discoverability (UX best practice) */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={filters}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                (selectedFilter === item || (item === 'All' && !selectedFilter)) && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(item === 'All' ? null : item)}
            >
              <Text
                style={[
                  styles.filterText,
                  (selectedFilter === item || (item === 'All' && !selectedFilter)) && styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* History List with Today/Yesterday/Earlier sections */}
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="clock" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>No History Yet</Text>
            <Text style={styles.emptySubtitle}>
              Your generated content will appear here
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Main' as any)}
            >
              <LinearGradient colors={Gradients.primary} style={styles.emptyButtonGradient}>
                <Text style={styles.emptyButtonText}>Start Creating</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#0D0F1C',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroBanner: {
    height: 180,
    marginTop: 50,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.lg,
  },
  heroContent: {
    alignItems: 'flex-start',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroStatText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  heroStatDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  searchWrapper: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: Spacing.sm,
    fontSize: 16,
    color: Colors.white,
  },
  filtersContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersList: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.secondary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  sectionCount: {
    fontSize: 13,
    color: Colors.textTertiary,
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  listContainer: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  historyCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  toolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  toolName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  categoryBadge: {
    backgroundColor: Colors.secondary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.secondary,
    fontWeight: '600',
  },
  contentText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  expandBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  expandText: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: Spacing.lg,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});

export default HistoryScreen;
