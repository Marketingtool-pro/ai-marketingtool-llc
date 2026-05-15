import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useToolsStore } from '../../store/toolsStore';
import { useAuthStore } from '../../store/authStore';
import { Colors, Gradients, Spacing, BorderRadius } from '../../constants/theme';
import { getToolIcon } from '../../constants/toolIcons';


// Desktop-preferred tool categories (big/complex tools — show preview on mobile)
const DESKTOP_PREFERRED_CATEGORIES = [
  'google-ads', 'google-analytics', 'ai-agents',
];

// Desktop-preferred tool slugs (specific big tools regardless of category)
const DESKTOP_PREFERRED_SLUGS = [
  'google-pmax', 'ga4-reports', 'ads-grader', 'schema-markup',
  'social-calendar', 'ai-campaign-optimizer', 'ai-content-planner',
  'ai-analyzer', 'ai-budget',
];

// Character threshold — outputs longer than this get the "best on desktop" banner
const LARGE_OUTPUT_THRESHOLD = 2000;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, 'ToolResult'>;

interface GeneratedOutput {
  id: string;
  content: string;
  liked: boolean;
}

const ToolResultScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { toolSlug, result, inputs: savedInputs } = route.params;
  const { tools, addGeneration } = useToolsStore();
  const { user } = useAuthStore();

  const tool = tools.find(t => t.slug === toolSlug);

  // Parse results from AI generation
  const [outputs, setOutputs] = useState<GeneratedOutput[]>(
    result?.outputs?.map((content: string, index: number) => ({
      id: `output-${index}`,
      content,
      liked: false,
    })) || []
  );

  const [selectedOutput, setSelectedOutput] = useState<string | null>(outputs[0]?.id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Auto-save to history on mount
  useEffect(() => {
    const autoSave = async () => {
      if (result?.outputs?.length && user && tool && !isSaved) {
        try {
          await addGeneration({
            userId: user.$id,
            toolId: tool.$id,
            toolName: tool.name,
            input: savedInputs || {},
            output: result.outputs.join('\n\n---\n\n'),
            outputType: tool.outputType || 'text',
            createdAt: new Date().toISOString(),
            isFavorite: false,
          });
          setIsSaved(true);
        } catch (e) {
          // Silent fail — user can manually save
        }
      }
    };
    autoSave();
  }, []);

  // Detect if this is a large/desktop-preferred result
  const isLargeOutput = useMemo(() => {
    if (!tool) return false;
    const isDesktopCategory = DESKTOP_PREFERRED_CATEGORIES.includes(tool.category);
    const isDesktopSlug = DESKTOP_PREFERRED_SLUGS.includes(tool.slug);
    const isLongContent = outputs.some(o => o.content.length > LARGE_OUTPUT_THRESHOLD);
    return isDesktopCategory || isDesktopSlug || isLongContent;
  }, [tool, outputs]);

  const desktopUrl = tool ? `https://app.marketingtool.pro/dashboard/tool/${tool.slug}` : '';

  const handleViewOnDesktop = () => {
    Linking.openURL(desktopUrl);
  };

  const handleEmailResult = async () => {
    const allContent = outputs.map(o => o.content).join('\n\n---\n\n');
    const subject = encodeURIComponent(`${tool?.name || 'Tool'} Result - MarketingTool`);
    const body = encodeURIComponent(allContent);
    Linking.openURL(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleCopy = async (content: string, id: string) => {
    await Clipboard.setStringAsync(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (content: string) => {
    try {
      await Share.share({
        message: content,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleLike = (id: string) => {
    setOutputs(prev =>
      prev.map(output =>
        output.id === id ? { ...output, liked: !output.liked } : output
      )
    );
  };

  const handleRegenerate = () => {
    if (tool && savedInputs) {
      navigation.navigate('ToolDetail', { toolSlug: tool.slug, prefillInputs: savedInputs });
    } else {
      navigation.goBack();
    }
  };

  const handleSaveToHistory = async () => {
    if (isSaved) {
      Alert.alert('Already Saved', 'This content is already in your history.');
      return;
    }
    if (!user || !tool) return;
    try {
      await addGeneration({
        userId: user.$id,
        toolId: tool.$id,
        toolName: tool.name,
        input: savedInputs || {},
        output: outputs.map(o => o.content).join('\n\n---\n\n'),
        outputType: tool.outputType || 'text',
        createdAt: new Date().toISOString(),
        isFavorite: false,
      });
      setIsSaved(true);
      Alert.alert('Saved', 'Content saved to your history');
    } catch (e) {
      Alert.alert('Error', 'Could not save. Please try again.');
    }
  };

  const handleExport = () => {
    Alert.alert(
      'Export Options',
      'Choose export format',
      [
        { text: 'Copy All', onPress: () => handleCopyAll() },
        { text: 'Share', onPress: () => handleShareAll() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleCopyAll = async () => {
    const allContent = outputs.map(o => o.content).join('\n\n---\n\n');
    await Clipboard.setStringAsync(allContent);
    Alert.alert('Copied', 'All outputs copied to clipboard');
  };

  const handleShareAll = async () => {
    const allContent = outputs.map(o => o.content).join('\n\n---\n\n');
    await handleShare(allContent);
  };

  return (
    <View style={styles.screenContainer}>
      {/* Header */}
      <LinearGradient colors={Gradients.dark} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Results</Text>
          <TouchableOpacity onPress={handleExport} style={styles.exportButton}>
            <Feather name="download" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {tool && (
          <View style={styles.toolInfo}>
            <View style={styles.toolIcon}>
              <Image
                source={getToolIcon(tool.slug, tool.category)}
                style={{ width: 44, height: 44 }}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.toolName}>{tool.name}</Text>
              <Text style={styles.outputCount}>{outputs.length} outputs generated</Text>
            </View>
          </View>
        )}
      </LinearGradient>

      {/* Output Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}
      >
        {outputs.map((output, index) => (
          <TouchableOpacity
            key={output.id}
            style={[styles.tab, selectedOutput === output.id && styles.tabActive]}
            onPress={() => setSelectedOutput(output.id)}
          >
            <Text style={[styles.tabText, selectedOutput === output.id && styles.tabTextActive]}>
              Option {index + 1}
            </Text>
            {output.liked && (
              <Feather name="heart" size={14} color={Colors.error} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {outputs.map((output) => (
          <View
            key={output.id}
            style={[
              styles.outputCard,
              selectedOutput === output.id && styles.outputCardSelected,
              selectedOutput !== output.id && styles.outputCardHidden,
            ]}
          >
            {/* Show truncated preview for large outputs, full for small tools */}
            {isLargeOutput && !showFullContent ? (
              <>
                <Text style={styles.outputText} numberOfLines={12}>
                  {output.content}
                </Text>
                <TouchableOpacity
                  style={styles.showMoreBtn}
                  onPress={() => setShowFullContent(true)}
                >
                  <Feather name="chevron-down" size={16} color={Colors.secondary} />
                  <Text style={styles.showMoreText}>Show full result</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.outputText}>{output.content}</Text>
            )}

            {/* Desktop banner for large/complex tool outputs */}
            {isLargeOutput && (
              <View style={styles.desktopBanner}>
                <View style={styles.desktopBannerHeader}>
                  <Feather name="monitor" size={18} color={Colors.secondary} />
                  <Text style={styles.desktopBannerTitle}>Best viewed on desktop</Text>
                </View>
                <Text style={styles.desktopBannerText}>
                  The tool completed successfully. This result is long, so we show a preview on mobile for readability. You can view the full output on desktop anytime.
                </Text>
                <View style={styles.desktopActions}>
                  <TouchableOpacity style={styles.desktopActionBtn} onPress={handleViewOnDesktop}>
                    <Feather name="external-link" size={16} color={Colors.white} />
                    <Text style={styles.desktopActionText}>View Full on Desktop</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.desktopActionBtnOutline} onPress={handleEmailResult}>
                    <Feather name="mail" size={16} color={Colors.secondary} />
                    <Text style={styles.desktopActionOutlineText}>Email Full Result</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.desktopActionBtnOutline} onPress={() => handleCopy(output.content, output.id)}>
                    <Feather name="copy" size={16} color={Colors.secondary} />
                    <Text style={styles.desktopActionOutlineText}>Copy Summary</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.outputActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleCopy(output.content, output.id)}
              >
                <Feather
                  name={copiedId === output.id ? 'check' : 'copy'}
                  size={20}
                  color={copiedId === output.id ? Colors.success : Colors.textSecondary}
                />
                <Text style={[
                  styles.actionText,
                  copiedId === output.id && { color: Colors.success }
                ]}>
                  {copiedId === output.id ? 'Copied!' : 'Copy'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleShare(output.content)}
              >
                <Feather name="share-2" size={20} color={Colors.textSecondary} />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleLike(output.id)}
              >
                <Feather
                  name="heart"
                  size={20}
                  color={output.liked ? Colors.error : Colors.textSecondary}
                />
                <Text style={[styles.actionText, output.liked && { color: Colors.error }]}>
                  {output.liked ? 'Liked' : 'Like'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={handleSaveToHistory}>
                <Feather
                  name={isSaved ? 'check' : 'bookmark'}
                  size={20}
                  color={isSaved ? Colors.success : Colors.textSecondary}
                />
                <Text style={[styles.actionText, isSaved && { color: Colors.success }]}>
                  {isSaved ? 'Saved' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Word Count */}
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Words</Text>
            <Text style={styles.statValue}>
              {outputs.find(o => o.id === selectedOutput)?.content.split(' ').length || 0}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Characters</Text>
            <Text style={styles.statValue}>
              {outputs.find(o => o.id === selectedOutput)?.content.length || 0}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Reading Time</Text>
            <Text style={styles.statValue}>
              {Math.ceil((outputs.find(o => o.id === selectedOutput)?.content.split(' ').length || 0) / 200)} min
            </Text>
          </View>
        </View>

        {/* Improvement Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips for Better Results</Text>
          <Text style={styles.tipText}>• Be specific with your input details</Text>
          <Text style={styles.tipText}>• Try different tones for variety</Text>
          <Text style={styles.tipText}>• Use keywords relevant to your audience</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleRegenerate}
        >
          <Feather name="refresh-cw" size={20} color={Colors.secondary} />
          <Text style={styles.secondaryButtonText}>Regenerate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Main' as any)}
        >
          <LinearGradient colors={Gradients.primary} style={styles.primaryButtonGradient}>
            <Feather name="plus" size={20} color={Colors.white} />
            <Text style={styles.primaryButtonText}>New Generation</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  exportButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  toolName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  outputCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  tabsScroll: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabsContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
    gap: 6,
  },
  tabActive: {
    backgroundColor: Colors.secondary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  outputCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  outputCardSelected: {
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  outputCardHidden: {
    display: 'none',
  },
  outputText: {
    fontSize: 16,
    color: Colors.white,
    lineHeight: 26,
    marginBottom: Spacing.lg,
  },
  showMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
    gap: 4,
  },
  showMoreText: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '600',
  },
  desktopBanner: {
    backgroundColor: Colors.secondary + '12',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.secondary + '30',
  },
  desktopBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  desktopBannerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.secondary,
  },
  desktopBannerText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  desktopActions: {
    gap: Spacing.sm,
  },
  desktopActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    gap: 8,
    marginBottom: 6,
  },
  desktopActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  desktopActionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary + '50',
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    gap: 8,
    marginBottom: 6,
  },
  desktopActionOutlineText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.secondary,
  },
  outputActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statsCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  tipsCard: {
    backgroundColor: Colors.secondary + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: Spacing.lg,
    paddingBottom: 34,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.secondary,
    gap: Spacing.sm,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
  },
  primaryButton: {
    flex: 1,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: Spacing.sm,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});

export default ToolResultScreen;
