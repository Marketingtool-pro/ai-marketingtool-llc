import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useToolsStore, Tool, TOOL_CATEGORIES, PLATFORMS } from '../../store/toolsStore';
import { useAuthStore } from '../../store/authStore';
import { Colors } from '../../constants/theme';
import { getToolIcon } from '../../constants/toolIcons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 16) / 3;

const ToolsScreen = () => {
  const navigation = useNavigation<any>();
  const { tools } = useToolsStore();
  const { profile } = useAuthStore();
  const isFreeUser = !profile?.subscription || profile.subscription === 'free';
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlatform, setActivePlatform] = useState('All');
  const [activeSubcategory, setActiveSubcategory] = useState('All');

  // 7 canonical platforms from app.marketingtool.pro web sidebar
  const PLATFORM_CATEGORIES: Record<string, string[]> = {
    'Google Ads': ['google-ads'],
    'Meta / Facebook': ['facebook-ads', 'meta-content'],
    'Social Media': ['social-media', 'instagram', 'tiktok', 'youtube', 'linkedin', 'twitter', 'pinterest'],
    'Content & SEO': ['google-seo', 'google-content', 'content-creation', 'copywriting'],
    'An-Analytics': ['google-analytics'],
    'E-commerce': ['shopify-products', 'shopify-ads', 'email-marketing', 'ecommerce-seo'],
    'AI Tools': ['ai-agents'],
  };

  const subcategories = useMemo(() => {
    if (activePlatform === 'All') return [];
    const ids = PLATFORM_CATEGORIES[activePlatform] || [];
    return TOOL_CATEGORIES.filter((c) => ids.includes(c.id));
  }, [activePlatform]);

  const filteredTools = useMemo(() => {
    let result = tools;
    if (activePlatform !== 'All') {
      const ids = PLATFORM_CATEGORIES[activePlatform] || [];
      result = result.filter((t) => ids.includes(t.category));
    }
    if (activeSubcategory !== 'All') {
      result = result.filter((t) => t.category === activeSubcategory);
    }
    if (searchQuery) {
      result = result.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [tools, activePlatform, activeSubcategory, searchQuery]);

  const platformTabs = [
    { name: 'All', img: null },
    { name: 'Google Ads', img: require('../../../assets/images/platforms/plat-google.webp') },
    { name: 'Meta / Facebook', img: require('../../../assets/images/platforms/plat-meta.webp') },
    { name: 'Social Media', img: require('../../../assets/images/platforms/plat-social.webp') },
    { name: 'Content & SEO', img: require('../../../assets/images/platforms/plat-seo.webp') },
    { name: 'An-Analytics', img: require('../../../assets/images/platforms/plat-analytics.webp') },
    { name: 'E-commerce', img: require('../../../assets/images/platforms/plat-ecommerce.webp') },
    { name: 'AI Tools', img: require('../../../assets/images/platforms/plat-ai.webp') },
  ];

  return (
    <View style={styles.screenContainer}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} stickyHeaderIndices={[]}>
        {/* Hero Banner */}
        <ImageBackground
          source={require('../../../assets/images/screens/tools-hero.webp')}
          style={styles.heroBanner}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(13,15,28,0.3)', 'rgba(13,15,28,0.85)']}
            style={styles.heroOverlay}
          >
            <View style={styles.heroContent}>
              <View style={styles.aiBadge}>
                <Feather name="zap" size={12} color="#F59E0B" />
                <Text style={styles.aiBadgeText}>AI Tools</Text>
              </View>
              <Text style={styles.heroTitle}>Marketing AI Tools</Text>
              <Text style={styles.heroSubtitle}>Google · Meta · Social · SEO · Analytics · E-com · AI</Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Feather name="search" size={18} color={Colors.textTertiary} />
            <TextInput
              placeholder="Search tools..."
              placeholderTextColor={Colors.textTertiary}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Platform Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.platformRow}
        >
          {platformTabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              style={[styles.platformChip, activePlatform === tab.name && styles.platformChipActive]}
              onPress={() => {
                Haptics.selectionAsync();
                setActivePlatform(tab.name);
                setActiveSubcategory('All');
              }}
            >
              {tab.img && <Image source={tab.img} style={{ width: 18, height: 18 }} resizeMode="contain" />}
              <Text style={[styles.platformText, activePlatform === tab.name && styles.platformTextActive]}>{tab.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Subcategory Chips */}
        {subcategories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subRow}
          >
            <TouchableOpacity
              style={[styles.subChip, activeSubcategory === 'All' && styles.subChipActive]}
              onPress={() => { Haptics.selectionAsync(); setActiveSubcategory('All'); }}
            >
              <Text style={[styles.subText, activeSubcategory === 'All' && styles.subTextActive]}>All</Text>
            </TouchableOpacity>
            {subcategories.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.subChip, activeSubcategory === s.id && styles.subChipActive]}
                onPress={() => { Haptics.selectionAsync(); setActiveSubcategory(s.id); }}
              >
                <Text style={[styles.subText, activeSubcategory === s.id && styles.subTextActive]}>{s.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Spacer */}
        <View style={{ height: 8 }} />

        {/* 3-Column Grid */}
        <View style={styles.grid}>
          {filteredTools.map((tool) => (
            <TouchableOpacity
              key={tool.$id}
              style={styles.card}
              activeOpacity={0.75}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('ToolDetail', { toolSlug: tool.slug });
              }}
            >
              <View style={styles.iconLiquid}>
                <View style={styles.iconGlow} />
                <Image source={getToolIcon(tool.slug)} style={styles.cardIcon} resizeMode="contain" />
                {tool.isPro && isFreeUser && (
                  <View style={styles.lockOverlay}>
                    <Feather name="lock" size={20} color="#FFF" />
                  </View>
                )}
              </View>
              <View style={styles.badgeRow}>
                {tool.isPro && (
                  <View style={styles.proBadge}><Text style={styles.proBadgeText}>PRO</Text></View>
                )}
              </View>
              <Text style={styles.cardName} numberOfLines={2}>{tool.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#0D0F1C',
  },
  heroBanner: {
    width: '100%',
    height: 200,
    marginTop: 44,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroContent: {},
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  aiBadgeText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 15,
  },
  platformRow: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  platformChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  platformChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  platformText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  platformTextActive: {
    color: '#FFFFFF',
  },
  subRow: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  subChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  subChipActive: {
    backgroundColor: 'rgba(124,58,237,0.2)',
  },
  subText: {
    color: Colors.textTertiary,
    fontSize: 12,
    fontWeight: '500',
  },
  subTextActive: {
    color: Colors.secondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(22, 24, 36, 0.55)',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  iconLiquid: {
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(124,58,237,0.15)',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  cardIcon: {
    width: 56,
    height: 56,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    zIndex: 5,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 4,
    minHeight: 16,
  },
  proBadge: {
    backgroundColor: 'rgba(253,151,7,0.25)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  proBadgeText: { fontSize: 8, color: '#FD9707', fontWeight: 'bold' },
  newBadge: {
    backgroundColor: 'rgba(34,197,94,0.25)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  newBadgeText: { fontSize: 8, color: '#22C55E', fontWeight: 'bold' },
  cardName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 14,
  },
});

export default ToolsScreen;
