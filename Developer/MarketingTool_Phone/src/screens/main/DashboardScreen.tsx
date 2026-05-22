import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Image,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
// Skia removed - using cross-platform LinearGradient instead for iOS compatibility
import AnimatedRN, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing as EasingRN
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAuthStore } from '../../store/authStore';
import { useToolsStore, TOOL_CATEGORIES } from '../../store/toolsStore';
import { Colors, Spacing, BorderRadius } from '../../constants/theme';
import { getToolIcon } from '../../constants/toolIcons';
import LottieView from 'lottie-react-native';
import Glass3DLogo from '../../components/common/Glass3DLogo';

const { width } = Dimensions.get('window');

const isVisionOS = (Platform.OS as any) === 'visionos';

const Animations = {
  aiRobot: require('../../../assets/animations/ai-robot.js'),
  pulseGlow: require('../../../assets/animations/pulse-glow.js'),
  loadingDots: require('../../../assets/animations/loading-dots.js'),
  liquidWave: require('../../../assets/animations/liquid-wave.js'),
};

const DashboardImages = {
  aiRobot: require('../../../assets/images/dashboard/ai-robot.webp'),
  aiDashboard: require('../../../assets/images/dashboard/ai-dashboard.webp'),
  analyticsCharacter: require('../../../assets/images/dashboard/analytics-character.webp'),
  seoRobot: require('../../../assets/images/dashboard/seo-robot.webp'),
  webAnalytics: require('../../../assets/images/dashboard/web-analytics.webp'),
};

const CategoryImageAssets = {
  'google-ads': require('../../../assets/images/categories/google-ads.webp'),
  'google-seo': require('../../../assets/images/categories/google-seo.webp'),
  'google-analytics': require('../../../assets/images/categories/google-analytics.webp'),
  'google-content': require('../../../assets/images/categories/google-content.webp'),
  'facebook-ads': require('../../../assets/images/categories/facebook-ads.webp'),
  'instagram': require('../../../assets/images/categories/instagram.webp'),
  'social-media': require('../../../assets/images/categories/social-media.webp'),
  'meta-content': require('../../../assets/images/categories/meta-content.webp'),
  'shopify-products': require('../../../assets/images/categories/shopify-products.webp'),
  'shopify-ads': require('../../../assets/images/categories/shopify-ads.webp'),
  'email-marketing': require('../../../assets/images/categories/email-marketing.webp'),
  'ecommerce-seo': require('../../../assets/images/categories/ecommerce-seo.webp'),
  'ai-agents': require('../../../assets/images/categories/ai-agents.webp'),
  'content-creation': require('../../../assets/images/categories/content-creation.webp'),
};

const BannerImages = {
  banner1: require('../../../assets/images/banners/banner-1.webp'),
  banner2: require('../../../assets/images/banners/banner-2.webp'),
  banner3: require('../../../assets/images/banners/banner-3.webp'),
  banner4: require('../../../assets/images/banners/banner-4.webp'),
  banner5: require('../../../assets/images/banners/banner-5.webp'),
};

const CategoryImages: Record<string, { image: any; gradient: string[] }> = {
  'google-ads': { image: CategoryImageAssets['google-ads'], gradient: ['#4285F4', '#1A73E8'] },
  'google-seo': { image: CategoryImageAssets['google-seo'], gradient: ['#34A853', '#1E8E3E'] },
  'google-analytics': { image: CategoryImageAssets['google-analytics'], gradient: ['#F9AB00', '#E37400'] },
  'google-content': { image: CategoryImageAssets['google-content'], gradient: ['#EA4335', '#C5221F'] },
  'facebook-ads': { image: CategoryImageAssets['facebook-ads'], gradient: ['#1877F2', '#0C5DC7'] },
  'instagram': { image: CategoryImageAssets['instagram'], gradient: ['#E4405F', '#C13584'] },
  'social-media': { image: CategoryImageAssets['social-media'], gradient: ['#833AB4', '#5851DB'] },
  'meta-content': { image: CategoryImageAssets['meta-content'], gradient: ['#0088FF', '#00C6FF'] },
  'shopify-products': { image: CategoryImageAssets['shopify-products'], gradient: ['#96BF48', '#5E8E3E'] },
  'shopify-ads': { image: CategoryImageAssets['shopify-ads'], gradient: ['#5C6BC0', '#3949AB'] },
  'email-marketing': { image: CategoryImageAssets['email-marketing'], gradient: ['#FF6B6B', '#EE5A5A'] },
  'ecommerce-seo': { image: CategoryImageAssets['ecommerce-seo'], gradient: ['#00BFA5', '#00897B'] },
  'ai-agents': { image: CategoryImageAssets['ai-agents'], gradient: ['#FF6B35', '#F7931E'] },
  'content-creation': { image: CategoryImageAssets['content-creation'], gradient: ['#7C4DFF', '#651FFF'] },
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Cross-platform Glass Bento Card (works on iOS + Android)
const GlassBentoCard = ({ children, color }: { children: React.ReactNode, color: string }) => (
  <View style={[styles.glassBentoContainer, {
    borderWidth: 1,
    borderColor: color + '30',
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  }]}>
    <LinearGradient
      colors={[color + '20', 'rgba(22, 24, 36, 0.55)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    <View style={styles.glassBentoContent}>
      {children}
    </View>
  </View>
);

const AnimatedStatCard = ({ stat, index, onPress }: { stat: any; index: number; onPress: () => void }) => {
  const scale = useSharedValue(1);
  const floating = useSharedValue(0);

  useEffect(() => {
    floating.value = withRepeat(
      withTiming(1, { duration: 2000 + index * 200, easing: EasingRN.bezier(0.4, 0, 0.2, 1) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: floating.value * -5 }
    ] as any
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(withTiming(0.9, { duration: 100 }), withTiming(1, { duration: 100 }));
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <AnimatedRN.View style={[styles.statCardWrapper, animatedStyle]}>
        <GlassBentoCard color={stat.color}>
          <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
            {stat.img ? (
              <Image source={stat.img} style={{ width: 28, height: 28 }} resizeMode="contain" />
            ) : (
              <Feather name={stat.icon as any} size={18} color={stat.color} />
            )}
          </View>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel} numberOfLines={1}>{stat.label}</Text>
        </GlassBentoCard>
      </AnimatedRN.View>
    </TouchableOpacity>
  );
};

const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, profile } = useAuthStore();
  const { tools, fetchTools, isLoading, generations, fetchGenerations } = useToolsStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const [campaignsCount, setCampaignsCount] = React.useState<number>(0);
  const [generationsCount, setGenerationsCount] = React.useState<number>(0);

  useEffect(() => {
    fetchTools();
    // Fetch user generations when logged in
    if (user?.$id) {
      fetchGenerations(user.$id);
    }
  }, [user?.$id]);

  // Update counts when generations change
  useEffect(() => {
    if (user?.$id && generations.length > 0) {
      // Get generations count for this user
      const userGenerations = generations.filter(g => g.userId === user.$id);
      setGenerationsCount(userGenerations.length);
      // Campaigns = unique tools used
      const uniqueTools = new Set(userGenerations.map(g => g.toolId));
      setCampaignsCount(uniqueTools.size);
    }
  }, [generations, user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTools();
    if (user?.$id) {
      await fetchGenerations(user.$id);
    }
    setRefreshing(false);
  };

  const stats = [
    { label: 'AI Tools', value: 'All', icon: 'zap', img: require('../../../assets/images/tool-icons-v2/ai-3d.webp'), color: Colors.secondary, badge: 'New', screen: 'Tools' },
    { label: 'Generated', value: generationsCount > 0 ? generationsCount.toString() : '0', icon: 'layers', img: require('../../../assets/images/tool-icons-v2/analytics-3d.webp'), color: Colors.success, badge: generationsCount > 0 ? 'Active' : 'Start', screen: 'History' },
    { label: 'Campaigns', value: campaignsCount > 0 ? campaignsCount.toString() : '0', icon: 'target', img: require('../../../assets/images/tool-icons-v2/rocket.webp'), color: Colors.accent, badge: campaignsCount > 0 ? `${campaignsCount} tools` : 'New', screen: 'Tools' },
    { label: 'Saved', value: generationsCount > 0 ? `${Math.min(generationsCount, 999)}` : '0', icon: 'bookmark', img: require('../../../assets/images/tool-icons-v2/trophy.webp'), color: Colors.gold, badge: generationsCount > 0 ? 'Saved' : 'None', screen: 'History' },
  ];

  // Horizontal banner data
  const bannerSlides = [
    { id: 1, image: BannerImages.banner1, title: 'AI Marketing Pro', subtitle: 'Create stunning ads in seconds', color: '#6C5CE7' },
    { id: 2, image: BannerImages.banner2, title: 'Smart Content', subtitle: 'AI-powered writing assistant', color: '#00B894' },
    { id: 3, image: BannerImages.banner3, title: 'ROI Boost', subtitle: 'Data-driven strategies', color: '#E17055' },
    { id: 4, image: BannerImages.banner4, title: 'Digital Growth', subtitle: 'Scale your business faster', color: '#0984E3' },
    { id: 5, image: BannerImages.banner5, title: 'Marketing Suite', subtitle: 'All tools in one place', color: '#A29BFE' },
  ];

  const quickActions = [
    { label: 'AI Chat', icon: 'message-circle', img: require('../../../assets/images/platforms/messenger.webp'), color: Colors.accent, screen: 'Chat' },
    { label: 'Meme Gen', icon: 'smile', img: require('../../../assets/images/platforms/instagram.webp'), color: Colors.secondary, screen: 'MemeGenerator' },
    { label: 'All Tools', icon: 'grid', img: require('../../../assets/images/platforms/google.webp'), color: Colors.success, screen: 'Tools' },
    { label: 'Reports', icon: 'bar-chart-2', img: require('../../../assets/images/platforms/youtube.webp'), color: Colors.gold, screen: 'History' },
  ];

  // Recommendations derived from the real tool catalog — picks one representative
  // tool from each major platform so links never orphan when tools.json changes.
  // Includes the Meme Generator as a special-case entry (separate screen).
  const popularTools = useMemo(() => {
    const categoryPicks: Array<{ cat: string; color: string }> = [
      { cat: 'google-ads', color: '#4285F4' },
      { cat: 'facebook-ads', color: '#1877F2' },
      { cat: 'instagram', color: '#E4405F' },
      { cat: 'shopify-products', color: '#96BF48' },
      { cat: 'email-marketing', color: '#EF4444' },
      { cat: 'google-seo', color: '#4285F4' },
      { cat: 'ai-agents', color: '#EC4899' },
    ];
    const picks = categoryPicks
      .map(({ cat, color }) => {
        const match = tools.find((t) => t.category === cat);
        return match
          ? { name: match.name, slug: match.slug, category: match.category, color }
          : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    // Meme Generator has its own dedicated screen (not ToolDetail).
    picks.push({
      name: 'Meme Generator',
      slug: 'meme-generator',
      category: 'Creative',
      color: '#EC4899',
    });
    return picks;
  }, [tools]);

  return (
    <View style={styles.screenContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.secondary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={[Colors.secondary, Colors.accent]}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarText}>
                    {user?.name && !/^\+?\d+$/.test(user.name) ? user.name.charAt(0).toUpperCase() : 'U'}
                  </Text>
                </LinearGradient>
              </View>
              <View>
                <Text style={styles.greeting}>Hi, {user?.name && !/^\+?\d+$/.test(user.name) ? user.name.split(' ')[0] : 'User'}</Text>
                <Text style={styles.subGreeting}>Welcome back</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Feather name="bell" size={22} color={Colors.white} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Hero Banner with Animation */}
        <TouchableOpacity
          style={styles.heroBanner}
          onPress={() => navigation.navigate('Main', { screen: 'Chat' } as any)}
          activeOpacity={0.9}
        >
          <Image
            source={DashboardImages.aiRobot}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Lottie Animation Overlay */}
          <View style={styles.heroAnimationContainer}>
            <LottieView
              source={Animations.aiRobot}
              autoPlay
              loop
              style={styles.heroAnimation}
            />
          </View>
          <LinearGradient
            colors={['transparent', 'rgba(6, 11, 40, 0.8)', 'rgba(6, 11, 40, 0.95)']}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Glass3DLogo type="ai" size={80} />
              <View style={styles.heroTitleRow}>
                <Text style={styles.heroTitle}>Marketing AI Assistant</Text>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
              <Text style={styles.heroSubtitle}>
                Create ads, blogs, emails & more with AI tools
              </Text>
              <View style={styles.heroButton}>
                <LottieView
                  source={Animations.pulseGlow}
                  autoPlay
                  loop
                  style={styles.buttonGlow}
                />
                <Text style={styles.heroButtonText}>Start Creating</Text>
                <Feather name="arrow-right" size={16} color={Colors.white} />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Premium Banner */}
        <TouchableOpacity
          style={styles.premiumBanner}
          onPress={() => navigation.navigate('Subscription')}
        >
          <LinearGradient
            colors={['#3D2914', '#16132B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.premiumGradient}
          >
            <View style={styles.premiumContent}>
              <View style={styles.premiumIcon}>
                <Feather name="star" size={20} color={Colors.gold} />
              </View>
              <View style={styles.premiumText}>
                <Text style={styles.premiumTitle}>Upgrade to Pro</Text>
                <Text style={styles.premiumSubtitle}>Unlock all AI tools & features</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={24} color={Colors.gold} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Horizontal Banner Carousel */}
        <View style={styles.bannerSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={width - 40}
            decelerationRate="fast"
            contentContainerStyle={styles.bannerScroll}
          >
            {bannerSlides.map((slide) => (
              <TouchableOpacity
                key={slide.id}
                style={styles.bannerSlide}
                onPress={() => navigation.navigate('Main', { screen: 'Tools' } as any)}
                activeOpacity={0.9}
              >
                <Image source={slide.image} style={styles.bannerImage} resizeMode="cover" />
                <LinearGradient
                  colors={['transparent', 'transparent', `${slide.color}99`]}
                  style={styles.bannerGradient}
                >
                  <Text style={styles.bannerTitle}>{slide.title}</Text>
                  <Text style={styles.bannerSubtitle}>{slide.subtitle}</Text>
                  <View style={styles.bannerButton}>
                    <Text style={styles.bannerButtonText}>Explore</Text>
                    <Feather name="arrow-right" size={14} color="#FFF" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats Grid with Animations - NOW CLICKABLE */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <AnimatedStatCard
              key={index}
              stat={stat}
              index={index}
              onPress={() => navigation.navigate('Main', { screen: stat.screen as any } as any)}
            />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionBtn}
                onPress={() => {
                  if (action.screen === 'MemeGenerator') {
                    navigation.navigate('MemeGenerator');
                  } else if (action.screen === 'Chat' || action.screen === 'Tools' || action.screen === 'History') {
                    navigation.navigate('Main', { screen: action.screen === 'Chat' ? 'Chat' : action.screen === 'Tools' ? 'Tools' : 'History' } as any);
                  }
                }}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                  {(action as any).img ? (
                    <Image source={(action as any).img} style={{ width: 32, height: 32 }} resizeMode="contain" />
                  ) : (
                    <Feather name={action.icon as any} size={24} color={action.color} />
                  )}
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tool Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Tools' } as any)}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {TOOL_CATEGORIES.slice(0, 8).map((category, index) => {
              const categoryData = CategoryImages[category.id];
              const gradientColors = categoryData?.gradient || [Colors.secondary, Colors.accent];
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.categoryCard}
                  onPress={() => navigation.navigate('Main', { screen: 'Tools' } as any)}
                  activeOpacity={0.85}
                >
                  {/* Background Image */}
                  {categoryData?.image && (
                    <Image
                      source={categoryData.image}
                      style={styles.categoryImage}
                      resizeMode="cover"
                    />
                  )}
                  {/* Gradient Overlay for liquid effect */}
                  <LinearGradient
                    colors={[
                      'transparent',
                      `${gradientColors[0]}40`,
                      `${gradientColors[1]}90`,
                    ]}
                    style={styles.categoryOverlay}
                  />
                  {/* Liquid glass effect layer */}
                  <View style={[styles.categoryGlassEffect, { borderColor: gradientColors[0] + '30' }]} />
                  {/* Liquid wave animation at bottom */}
                  <View style={styles.categoryWaveContainer}>
                    <LottieView
                      source={Animations.liquidWave}
                      autoPlay
                      loop
                      speed={0.5}
                      style={styles.categoryWave}
                    />
                  </View>
                  {/* Content */}
                  <View style={styles.categoryContent}>
                    <View style={[styles.categoryIconNew, { backgroundColor: gradientColors[0] + '25' }]}>
                      <Feather name={category.icon as any} size={20} color={Colors.white} />
                    </View>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <View style={styles.categoryCountBadge}>
                      <Feather name="chevron-right" size={14} color={Colors.textSecondary} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Popular Tools */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Tools</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Tools' } as any)}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.popularList}>
            {popularTools.map((tool: typeof popularTools[number], index: number) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.popularItem,
                  index === popularTools.length - 1 && styles.popularItemLast
                ]}
                onPress={() => {
                  if (tool.slug === 'meme-generator') {
                    navigation.navigate('MemeGenerator');
                  } else {
                    navigation.navigate('ToolDetail', { toolSlug: tool.slug });
                  }
                }}
              >
                <View style={styles.popularInfo}>
                  <View style={[styles.popularIcon, { backgroundColor: tool.color + '20' }]}>
                    <Image
                      source={(tool as any).img || getToolIcon(tool.slug, tool.category)}
                      style={{ width: 32, height: 32 }}
                      resizeMode="contain"
                    />
                    {/* Same Pro lock visual as ToolsScreen / ToolDetailScreen
                        so locked state is consistent across every screen. */}
                    {(tool as any).isPro && profile?.subscription === 'free' && (
                      <View style={styles.dashLockOverlay}>
                        <Feather name="lock" size={14} color="#FFF" />
                      </View>
                    )}
                  </View>
                  <View>
                    <View style={styles.popularNameRow}>
                      <Text style={styles.popularName}>{tool.name}</Text>
                      {(tool as any).isPro && (
                        <View style={styles.dashProBadge}>
                          <Text style={styles.dashProBadgeText}>PRO</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.popularUsesText}>{tool.category}</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={20} color={Colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
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
  glassBentoContainer: {
    position: 'relative',
    width: (width - Spacing.lg * 2 - Spacing.sm * 3) / 4,
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
  },
  skiaCanvas: {
    ...StyleSheet.absoluteFillObject,
  },
  glassBentoContent: {
    flex: 1,
    padding: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCardWrapper: {
    width: (width - Spacing.lg * 2 - Spacing.sm * 3) / 4,
    height: 100,
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: Spacing.md,
  },
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  subGreeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
  },
  heroBanner: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    height: 220,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroAnimationContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 80,
    height: 80,
    zIndex: 1,
  },
  heroAnimation: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.md,
  },
  heroContent: {
    alignItems: 'flex-start',
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#22C55E',
  },
  buttonGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    left: -5,
    top: -5,
  },
  heroSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  heroButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  premiumBanner: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(253, 151, 7, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gold,
  },
  premiumSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - Spacing.lg * 2 - Spacing.sm * 3) / 4,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    overflow: 'hidden',
  },
  statGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.md,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statBadge: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statBadgeText: {
    fontSize: 8,
    fontWeight: '600',
  },
  bannerSection: {
    marginBottom: Spacing.lg,
  },
  bannerScroll: {
    paddingHorizontal: Spacing.lg,
  },
  bannerSlide: {
    width: width - 48,
    height: 160,
    marginRight: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.md,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
    gap: 4,
  },
  bannerButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: Spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionBtn: {
    alignItems: 'center',
    width: (width - Spacing.lg * 2 - Spacing.md * 3) / 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  categoriesScroll: {
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.lg,
  },
  categoryCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    height: 220,
    marginRight: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.card,
  },
  categoryImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  categoryOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  categoryGlassEffect: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
  },
  categoryContent: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'flex-end',
  },
  categoryIconNew: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  categoryCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
  },
  categoryWaveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    overflow: 'hidden',
  },
  categoryWave: {
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  popularList: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  popularItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  popularItemLast: {
    borderBottomWidth: 0,
  },
  popularInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  dashLockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  dashProBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  dashProBadgeText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '700',
  },
  popularNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.white,
  },
  trendingBadge: {
    marginLeft: Spacing.xs,
    padding: 2,
    backgroundColor: Colors.success + '20',
    borderRadius: 4,
  },
  popularUsesText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

export default DashboardScreen;
