import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useToolsStore, Tool, ToolInput } from '../../store/toolsStore';
import { useAuthStore } from '../../store/authStore';
import { Colors, Gradients, Spacing, BorderRadius } from '../../constants/theme';
import { getToolIcon } from '../../constants/toolIcons';


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, 'ToolDetail'>;

const ToolDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { toolSlug, prefillInputs } = route.params;
  const { tools, generateContent, isGenerating } = useToolsStore();
  const { profile } = useAuthStore();

  const [tool, setTool] = useState<Tool | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [selectedTone, setSelectedTone] = useState('professional');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [outputCount, setOutputCount] = useState(3);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tones = ['Professional', 'Casual', 'Friendly', 'Persuasive', 'Formal', 'Creative'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Chinese', 'Japanese'];

  useEffect(() => {
    const foundTool = tools.find(t => t.slug === toolSlug);
    if (foundTool) {
      setTool(foundTool);
      // Initialize input values (prefill if coming from regenerate)
      const initialValues: Record<string, string> = {};
      foundTool.inputs.forEach(input => {
        initialValues[input.name] = prefillInputs?.[input.name] || '';
      });
      setInputValues(initialValues);
    }
  }, [toolSlug, tools]);

  const handleInputChange = (name: string, value: string) => {
    setInputValues(prev => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    if (!tool) return false;
    for (const input of tool.inputs) {
      if (input.required && !inputValues[input.name]?.trim()) {
        Alert.alert('Required Field', `Please fill in ${input.label}`);
        return false;
      }
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!validateInputs() || !tool || isGenerating) return;

    // PRO LOCK: gate Pro tools for free users
    if (tool.isPro && profile?.subscription === 'free') {
      Alert.alert(
        '🔒 Pro Tool Locked',
        `${tool.name} is a Professional plan feature. Upgrade to unlock 500+ generations/month, advanced automation, and cross-platform intelligence.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade to Pro', onPress: () => navigation.navigate('Subscription') },
        ]
      );
      return;
    }

    // QUOTA: free trial = 3/day, Starter = 200/mo, Pro = 500/mo
    if (profile?.subscription === 'free' && (profile?.credits || 0) <= 0) {
      Alert.alert(
        'Daily Limit Reached',
        'Free trial allows 3 generations per day. Upgrade to Starter ($29/mo, 200 generations) or Pro ($59/mo, 500 generations).',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'See Plans', onPress: () => navigation.navigate('Subscription') },
        ]
      );
      return;
    }

    // Start elapsed timer
    setElapsedSeconds(0);
    timerRef.current = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);

    try {
      const result = await generateContent(tool.$id, {
        ...inputValues,
        tone: selectedTone,
        language: selectedLanguage,
        outputCount,
      });

      navigation.navigate('ToolResult', {
        toolSlug: tool.slug,
        result,
        inputs: inputValues,
      });
    } catch (error: any) {
      Alert.alert('Generation Failed', error.message || 'Please try again');
    } finally {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const renderInput = (input: ToolInput) => {
    switch (input.type) {
      case 'textarea':
        return (
          <View key={input.name} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {input.label}
              {input.required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={input.placeholder}
              placeholderTextColor={Colors.textTertiary}
              value={inputValues[input.name]}
              onChangeText={(value) => handleInputChange(input.name, value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {input.helperText && (
              <Text style={styles.helperText}>{input.helperText}</Text>
            )}
          </View>
        );

      case 'select':
        return (
          <View key={input.name} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {input.label}
              {input.required && <Text style={styles.required}> *</Text>}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.selectOptions}>
                {input.options?.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.selectOption,
                      inputValues[input.name] === option && styles.selectOptionActive,
                    ]}
                    onPress={() => handleInputChange(input.name, option)}
                  >
                    <Text
                      style={[
                        styles.selectOptionText,
                        inputValues[input.name] === option && styles.selectOptionTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );

      default:
        return (
          <View key={input.name} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {input.label}
              {input.required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={input.placeholder}
              placeholderTextColor={Colors.textTertiary}
              value={inputValues[input.name]}
              onChangeText={(value) => handleInputChange(input.name, value)}
            />
            {input.helperText && (
              <Text style={styles.helperText}>{input.helperText}</Text>
            )}
          </View>
        );
    }
  };

  if (!tool) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <LinearGradient colors={Gradients.dark} style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.favoriteButton}>
              <Feather name="heart" size={24} color={Colors.white} />
            </View>
          </View>

          <View style={styles.toolInfo}>
            {/* Use the same getToolIcon image source as ToolsScreen / Dashboard
                / ChatScreen so the icon stays identical across the entire app.
                The Feather fallback was a placeholder that always rendered
                'zap' because Tool.icon is hardcoded to 'zap' in toolsStore. */}
            <View style={[styles.toolIcon, { backgroundColor: Colors.secondary + '20' }]}>
              <Image source={getToolIcon(tool.slug)} style={{ width: 48, height: 48 }} resizeMode="contain" />
              {tool.isPro && profile?.subscription === 'free' && (
                <View style={styles.lockOverlay}>
                  <Feather name="lock" size={18} color="#FFF" />
                </View>
              )}
            </View>
            <View style={styles.toolMeta}>
              <View style={styles.toolBadges}>
                {tool.isPro && (
                  <View style={[styles.badge, { backgroundColor: Colors.accent }]}>
                    <Text style={styles.badgeText}>PRO</Text>
                  </View>
                )}
              </View>
              <Text style={styles.toolName}>{tool.name}</Text>
              <Text style={styles.toolDescription}>{tool.shortDescription}</Text>
            </View>
          </View>

          <View style={styles.toolStats}>
            <View style={styles.statItem}>
              <Feather name="clock" size={16} color={Colors.textSecondary} />
              <Text style={styles.statText}>~10 sec</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Dynamic Inputs */}
          {tool.inputs.map(renderInput)}

          {/* Tone Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tone</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.selectOptions}>
                {tones.map((tone) => (
                  <TouchableOpacity
                    key={tone}
                    style={[
                      styles.selectOption,
                      selectedTone.toLowerCase() === tone.toLowerCase() && styles.selectOptionActive,
                    ]}
                    onPress={() => setSelectedTone(tone.toLowerCase())}
                  >
                    <Text
                      style={[
                        styles.selectOptionText,
                        selectedTone.toLowerCase() === tone.toLowerCase() && styles.selectOptionTextActive,
                      ]}
                    >
                      {tone}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Language Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Language</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.selectOptions}>
                {languages.map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    style={[
                      styles.selectOption,
                      selectedLanguage === lang && styles.selectOptionActive,
                    ]}
                    onPress={() => setSelectedLanguage(lang)}
                  >
                    <Text
                      style={[
                        styles.selectOptionText,
                        selectedLanguage === lang && styles.selectOptionTextActive,
                      ]}
                    >
                      {lang}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Output Count */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Number of Outputs</Text>
            <View style={styles.outputCountContainer}>
              {[1, 3, 5].map((count) => (
                <TouchableOpacity
                  key={count}
                  style={[
                    styles.outputCountBtn,
                    outputCount === count && styles.outputCountBtnActive,
                  ]}
                  onPress={() => setOutputCount(count)}
                >
                  <Text
                    style={[
                      styles.outputCountText,
                      outputCount === count && styles.outputCountTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Credits Info */}
          {profile?.subscription === 'free' && (
            <View style={styles.creditsInfo}>
              <Feather name="zap" size={20} color={Colors.warning} />
              <Text style={styles.creditsText}>
                {profile?.credits || 0} credits remaining
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Subscription')}>
                <Text style={styles.upgradeLink}>Upgrade</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Generate Button — switches to "Upgrade to Pro" CTA when the
            current tool is Pro-locked for a free user. handleGenerate
            already routes to Subscription in that case; this just makes
            the visual state match (lock icon + amber gradient) so the
            user knows BEFORE tapping. */}
        <View style={styles.generateContainer}>
          {(() => {
            const isLockedForUser = tool.isPro && profile?.subscription === 'free';
            return (
              <TouchableOpacity
                onPress={handleGenerate}
                disabled={isGenerating}
                style={styles.generateButton}
              >
                <LinearGradient
                  colors={isLockedForUser ? ['#F59E0B', '#D97706'] : Gradients.primary}
                  style={styles.generateGradient}
                >
                  {isGenerating ? (
                    <View style={styles.generatingContent}>
                      <ActivityIndicator color={Colors.white} />
                      <Text style={styles.generateText}>
                        {elapsedSeconds >= 5 ? `Still generating... ${elapsedSeconds}s` : `Generating... ${elapsedSeconds}s`}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.generateContent}>
                      <Feather name={isLockedForUser ? 'lock' : 'zap'} size={24} color={Colors.white} />
                      <Text style={styles.generateText}>
                        {isLockedForUser ? 'Upgrade to Pro' : 'Generate Content'}
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })()}
        </View>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolInfo: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  toolIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    // Required so the absolutely-positioned lockOverlay anchors here.
    position: 'relative',
    overflow: 'hidden',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  toolMeta: {
    flex: 1,
  },
  toolBadges: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.white,
  },
  toolName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  toolStats: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.error,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.white,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  helperText: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 6,
  },
  selectOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  selectOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectOptionActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  selectOptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  selectOptionTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  outputCountContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  outputCountBtn: {
    width: 60,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outputCountBtnActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  outputCountText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  outputCountTextActive: {
    color: Colors.white,
  },
  creditsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '15',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  creditsText: {
    flex: 1,
    fontSize: 14,
    color: Colors.warning,
  },
  upgradeLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
  },
  generateContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: 34,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  generateButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  generateGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  generateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  generatingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  generateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
});

export default ToolDetailScreen;
