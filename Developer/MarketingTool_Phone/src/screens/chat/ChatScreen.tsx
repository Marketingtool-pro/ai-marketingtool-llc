import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors, Gradients, Spacing, BorderRadius } from '../../constants/theme';
import { useAuthStore, parseAppwriteResponse } from '../../store/authStore';
import { functions, account } from '../../services/appwrite';
import { ExecutionMethod } from 'react-native-appwrite';
import { getToolIcon } from '../../constants/toolIcons';
import { useToolsStore, Tool } from '../../store/toolsStore';

const { width } = Dimensions.get('window');

// Chat bot image
const ChatBotImage = require('../../../assets/images/screens/chat-bot.webp');
const AiAssistantImage = require('../../../assets/images/screens/ai-assistant.webp');
const LogoImage = require('../../../assets/images/logo.jpeg');

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
  retryMessage?: string;
}

interface SuggestedPrompt {
  iconSlug: string;
  image?: any;
  title: string;
  description: string;
  prompt: string;
  color: string;
}

// Animated Ripple Component (LiMo style)
const AnimatedRipple = () => {
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createRippleAnimation = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
        ])
      );
    };

    const anim = Animated.parallel([
      createRippleAnimation(ripple1, 0),
      createRippleAnimation(ripple2, 1000),
      createRippleAnimation(ripple3, 2000),
    ]);
    anim.start();
    return () => anim.stop();
  }, []);

  const createRippleStyle = (anim: Animated.Value) => ({
    position: 'absolute' as const,
    width: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 280],
    }),
    height: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 280],
    }),
    borderRadius: 140,
    borderWidth: 2,
    borderColor: anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['rgba(124, 58, 237, 0.6)', 'rgba(124, 58, 237, 0.3)', 'rgba(124, 58, 237, 0)'],
    }),
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
  });

  return (
    <View style={styles.rippleContainer}>
      <Animated.View style={createRippleStyle(ripple1)} />
      <Animated.View style={createRippleStyle(ripple2)} />
      <Animated.View style={createRippleStyle(ripple3)} />
    </View>
  );
};

// Bot avatar icon - uses real logo with dark background
const BotAvatar = ({ size = 32 }: { size?: number }) => {
  return (
    <View style={[styles.botAvatarContainer, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image
        source={LogoImage}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        resizeMode="cover"
      />
    </View>
  );
};

type ChatTab = 'chat' | 'tools' | 'history';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ChatScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { profile } = useAuthStore();
  const { tools, categories } = useToolsStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<ChatTab>('chat');
  const [activeCategory, setActiveCategory] = useState('All');
  const typingAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;


  const suggestedPrompts: SuggestedPrompt[] = [
    {
      iconSlug: 'facebook-ad-copy',
      image: require('../../../assets/images/platforms/facebook.webp'),
      title: 'Write Ad Copy',
      description: 'Create compelling ads',
      prompt: 'Write a compelling Facebook ad copy for a fitness app',
      color: Colors.gold,
    },
    {
      iconSlug: 'strategy',
      image: require('../../../assets/images/platforms/google.webp'),
      title: 'Marketing Strategy',
      description: 'Get expert advice',
      prompt: 'Give me a marketing strategy for launching a new product',
      color: Colors.cyan,
    },
    {
      iconSlug: 'cold-outreach-email',
      image: require('../../../assets/images/platforms/messenger.webp'),
      title: 'Email Campaign',
      description: 'Generate emails',
      prompt: 'Generate 5 email subject lines for a product launch',
      color: Colors.secondary,
    },
    {
      iconSlug: 'instagram-captions',
      image: require('../../../assets/images/platforms/instagram.webp'),
      title: 'Social Content',
      description: 'Create viral posts',
      prompt: 'Create an engaging Instagram caption for a travel photo',
      color: Colors.purple,
    },
    {
      iconSlug: 'seo-meta-title',
      image: require('../../../assets/images/platforms/youtube.webp'),
      title: 'SEO & Keywords',
      description: 'Optimize for search',
      prompt: 'Help me find the best keywords for my e-commerce store',
      color: Colors.success,
    },
    {
      iconSlug: 'blog-post-ideas',
      image: require('../../../assets/images/platforms/medium.webp'),
      title: 'Blog Content',
      description: 'Write blog posts',
      prompt: 'Give me 10 blog post ideas for a SaaS company',
      color: '#FF6B6B',
    },
  ];

  useEffect(() => {
    if (isTyping) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      anim.start();
      return () => anim.stop();
    } else {
      typingAnim.setValue(0);
    }
  }, [isTyping]);

  // Pulse animation for input border
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Track consecutive errors for smart recovery
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const lastFailedMessage = useRef<string | null>(null);

  const handleSend = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    scrollToBottom();

    try {
      const response = await callWindmillChat(messageText, messages);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setConsecutiveErrors(0);
      lastFailedMessage.current = null;
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I encountered an error connecting to the AI. Please try again.',
        timestamp: new Date(),
        isError: true,
        retryMessage: messageText,
      };
      setMessages(prev => [...prev, errorMessage]);
      setConsecutiveErrors(prev => prev + 1);
      lastFailedMessage.current = messageText;
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  // Retry a failed message
  const handleRetry = (retryText: string) => {
    // Remove the error message before retrying
    setMessages(prev => prev.filter(m => !(m.isError && m.retryMessage === retryText)));
    handleSend(retryText);
  };

  // AI Chat via Appwrite Functions (server-side proxy to Windmill)
  // The Windmill token is stored server-side in the Appwrite Function environment,
  // never exposed to the client app binary.
  const callWindmillChat = async (userMessage: string, history: Message[], retryCount = 0): Promise<string> => {
    // On retry, reduce history to avoid payload size issues
    const historyLimit = retryCount > 0 ? 4 : 10;
    const conversationHistory = history
      .filter(m => !m.isError)
      .slice(-historyLimit)
      .map(m => ({
        role: m.role,
        content: m.content,
      }));

    const systemPrompt = `You are an expert AI marketing assistant for MarketingTool.pro.
You help users with:
- Writing ad copy (Google Ads, Facebook, Instagram)
- Marketing strategies and campaigns
- Email marketing and subject lines
- Social media content
- SEO optimization
- E-commerce product descriptions

Be helpful, specific, and provide actionable advice. Use formatting with bullet points and sections when appropriate.`;

    try {
      // Validate session is still active before making the call
      if (retryCount === 0) {
        try {
          await account.get();
        } catch (sessionError) {
          if (__DEV__) console.log('Session validation failed - attempting chat anyway');
        }
      }

      // Sync execution (false). Async + getExecution polling needs
      // executions.read scope, and even when granted it adds 1-30s of
      // polling latency. fetch() under the hood is async at the JS layer
      // so this doesn't block the UI thread / cause ANRs.
      const execution = await functions.createExecution(
        'chat-ai',
        JSON.stringify({
          system_prompt: systemPrompt,
          user_message: userMessage,
          conversation_history: conversationHistory,
        }),
        false,
        '/',
        ExecutionMethod.POST
      );

      const result = parseAppwriteResponse(execution.responseBody);
      if (result.error) throw new Error(result.error);
      return (
        result.response ||
        result.content ||
        result.message ||
        result.result ||
        result.text ||
        'I could not generate a response.'
      );
    } catch (error) {
      // Retry once with reduced history (handles payload size / timeout issues)
      if (retryCount < 1) {
        if (__DEV__) console.log('Chat call failed, retrying with reduced history...');
        return callWindmillChat(userMessage, history, retryCount + 1);
      }
      throw error;
    }
  };

  const handlePromptPress = (prompt: string) => {
    handleSend(prompt);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={styles.messageAvatarContainer}>
            <BotAvatar size={32} />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.assistantBubble,
            message.isError && styles.errorBubble,
          ]}
        >
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {message.content}
          </Text>
          {message.isError && message.retryMessage && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => handleRetry(message.retryMessage!)}
            >
              <Feather name="refresh-cw" size={14} color={Colors.white} />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.timestamp}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color={Colors.white} />
          </TouchableOpacity>
          <BotAvatar size={40} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>AI MarketingTool</Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Ready</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerActions}>
          {messages.length > 0 && (
            <TouchableOpacity onPress={clearChat} style={styles.headerButton}>
              <Feather name="trash-2" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
          <View style={styles.creditsContainer}>
            <Feather name="zap" size={14} color={Colors.gold} />
            <Text style={styles.creditsText}>{profile?.generationsCount || 10}</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              {/* AI Bot Image with Ripples */}
              <View style={styles.botSection}>
                <AnimatedRipple />
                <View style={styles.botImageContainer}>
                  <Image source={ChatBotImage} style={styles.botImage} resizeMode="cover" />
                  <LinearGradient
                    colors={['transparent', 'rgba(124, 58, 237, 0.3)']}
                    style={styles.botImageOverlay}
                  />
                </View>
              </View>

              <Text style={styles.emptyTitle}>Hi, I'm Marketing AI!</Text>
              <Text style={styles.emptySubtitle}>Your AI Marketing Assistant</Text>

              {/* Chat / Tools / History Tabs */}
              <View style={styles.tabBar}>
                <TouchableOpacity
                  style={[styles.tabItem, activeTab === 'chat' && styles.tabItemActive]}
                  onPress={() => setActiveTab('chat')}
                >
                  <Feather name="message-circle" size={16} color={activeTab === 'chat' ? Colors.white : Colors.textSecondary} />
                  <Text style={[styles.tabText, activeTab === 'chat' && styles.tabTextActive]}>Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabItem, activeTab === 'tools' && styles.tabItemActive]}
                  onPress={() => setActiveTab('tools')}
                >
                  <Feather name="grid" size={16} color={activeTab === 'tools' ? Colors.white : Colors.textSecondary} />
                  <Text style={[styles.tabText, activeTab === 'tools' && styles.tabTextActive]}>Tools</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabItem, activeTab === 'history' && styles.tabItemActive]}
                  onPress={() => setActiveTab('history')}
                >
                  <Feather name="clock" size={16} color={activeTab === 'history' ? Colors.white : Colors.textSecondary} />
                  <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>History</Text>
                </TouchableOpacity>
              </View>

              {/* Tab Content */}
              {activeTab === 'chat' && (
                <View style={styles.promptsGrid}>
                  {suggestedPrompts.map((prompt, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.promptCard}
                      onPress={() => handlePromptPress(prompt.prompt)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.promptIcon, { backgroundColor: prompt.color + '20' }]}>
                        <Image
                          source={prompt.image || getToolIcon(prompt.iconSlug)}
                          style={{ width: 36, height: 36 }}
                          resizeMode="contain"
                        />
                      </View>
                      <View style={styles.promptTextContainer}>
                        <Text style={styles.promptTitle}>{prompt.title}</Text>
                        <Text style={styles.promptDescription}>{prompt.description}</Text>
                      </View>
                      <Text style={[styles.promptArrow, { color: prompt.color }]}>›</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {activeTab === 'tools' && (
                <View style={styles.toolsTabContent}>
                  {/* Info Banner */}
                  <View style={styles.infoBanner}>
                    <Feather name="check-circle" size={18} color={Colors.success} />
                    <Text style={styles.infoBannerText}>
                      Same tools as web • Same AI • Same backend • Full execution
                    </Text>
                  </View>

                  {/* Category Filters */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                    {['All', ...categories].map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
                        onPress={() => setActiveCategory(cat)}
                      >
                        <Text style={[styles.categoryChipText, activeCategory === cat && styles.categoryChipTextActive]}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={styles.toolsCount}>
                    {activeCategory === 'All'
                      ? `${tools.length} AI Marketing Tools`
                      : `${tools.filter(t => t.category === activeCategory).length} tools`}
                  </Text>

                  {/* Tools List */}
                  {(activeCategory === 'All' ? tools : tools.filter(t => t.category === activeCategory)).map((tool) => (
                    <TouchableOpacity
                      key={tool.$id}
                      style={styles.toolListCard}
                      onPress={() => navigation.navigate('ToolDetail', { toolSlug: tool.slug })}
                      activeOpacity={0.7}
                    >
                      <View style={styles.toolListIcon}>
                        <Image
                          source={getToolIcon(tool.slug)}
                          style={{ width: 36, height: 36 }}
                          resizeMode="contain"
                        />
                      </View>
                      <View style={styles.toolListInfo}>
                        <View style={styles.toolListNameRow}>
                          <Text style={styles.toolListName} numberOfLines={1}>{tool.name}</Text>
                          {tool.isPro && (
                            <View style={styles.proBadge}>
                              <Text style={styles.proBadgeText}>PRO</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.toolListDesc} numberOfLines={1}>{tool.shortDescription}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.runButton}
                        onPress={() => navigation.navigate('ToolDetail', { toolSlug: tool.slug })}
                      >
                        <Feather name="play" size={14} color={Colors.white} />
                        <Text style={styles.runButtonText}>Run</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {activeTab === 'history' && (
                <View style={styles.historyTabContent}>
                  {messages.length === 0 ? (
                    <View style={styles.emptyHistory}>
                      <Feather name="clock" size={48} color={Colors.textTertiary} />
                      <Text style={styles.emptyHistoryText}>No chat history yet</Text>
                      <Text style={styles.emptyHistorySubtext}>Start a conversation to see your history here</Text>
                    </View>
                  ) : (
                    <Text style={styles.emptyHistorySubtext}>Previous conversations will appear here</Text>
                  )}
                </View>
              )}
            </View>
          ) : (
            <>
              {messages.map(renderMessage)}
              {/* Typing dots removed - direct reply */}
            </>
          )}
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <LinearGradient
            colors={['#7C3AED', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.inputGradientBorder}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Ask me anything..."
                placeholderTextColor={Colors.textTertiary}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={1000}
              />
              <TouchableOpacity
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={() => handleSend()}
                disabled={!inputText.trim() || isTyping}
              >
                {isTyping ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Feather name="send" size={20} color={Colors.white} />
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  headerInfo: {
    marginLeft: Spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: 6,
  },
  onlineText: {
    fontSize: 12,
    color: Colors.success,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  creditsText: {
    color: Colors.gold,
    fontWeight: '600',
    fontSize: 14,
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  botSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    height: 220,
  },
  rippleContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 280,
  },
  botImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  botImage: {
    width: '100%',
    height: '100%',
  },
  botImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  botAvatarContainer: {
    backgroundColor: '#0D0F1C',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    gap: 6,
  },
  tabItemActive: {
    backgroundColor: Colors.secondary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.white,
  },
  toolsTabContent: {
    width: '100%',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  infoBannerText: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '500',
    flex: 1,
  },
  categoryScroll: {
    marginBottom: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: Colors.secondary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  categoryChipTextActive: {
    color: Colors.white,
  },
  toolsCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  toolListCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toolListIcon: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolListInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  toolListNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  toolListName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
    flexShrink: 1,
  },
  proBadge: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
  },
  toolListDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  toolListMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  toolListRating: {
    fontSize: 12,
    color: Colors.gold,
    fontWeight: '600',
  },
  toolListUses: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginLeft: 4,
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  runButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
  },
  historyTabContent: {
    width: '100%',
    paddingVertical: Spacing.xl,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyHistoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  inputPreview: {
    width: width - 48,
    marginBottom: Spacing.xl,
  },
  inputPreviewGradient: {
    borderRadius: BorderRadius.full,
    padding: 2,
  },
  inputPreviewInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.full - 2,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
  },
  inputPreviewText: {
    flex: 1,
    color: Colors.textTertiary,
    fontSize: 16,
  },
  inputPreviewSend: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptsGrid: {
    width: '100%',
    gap: Spacing.sm,
  },
  promptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  promptIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptTextContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  promptTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
  },
  promptDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  promptArrow: {
    fontSize: 24,
    fontWeight: '300',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatarContainer: {
    marginRight: Spacing.sm,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  userBubble: {
    backgroundColor: Colors.secondary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: 'rgba(22, 24, 36, 0.55)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  errorBubble: {
    backgroundColor: '#3D1F1F',
    borderWidth: 1,
    borderColor: '#FF6B6B40',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 8,
    gap: 6,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 16,
    color: Colors.white,
    lineHeight: 24,
  },
  userMessageText: {
    color: Colors.white,
  },
  timestamp: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
    alignSelf: 'flex-end',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderBottomLeftRadius: 4,
    padding: Spacing.md,
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textSecondary,
  },
  inputContainer: {
    padding: Spacing.md,
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  inputGradientBorder: {
    borderRadius: BorderRadius.full,
    padding: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.full - 2,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.white,
    maxHeight: 100,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.secondary + '50',
  },
});

export default ChatScreen;
