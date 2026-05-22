import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Colors, Gradients } from '../../constants/theme';
import AnimatedBackground from '../../components/common/AnimatedBackground';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const CARD_SIZE = width * 0.52;
const ICON_SIZE = CARD_SIZE * 0.55;

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  icon: ImageSourcePropType;
}

const ONBOARDING_DATA: OnboardingItem[] = [
  {
    id: '1',
    title: 'AI Marketing Tools',
    description: 'Access the most comprehensive suite of AI-powered marketing tools. From ad copy to blog posts, we\'ve got you covered.',
    icon: require('../../../assets/images/tool-icons-v2/bot.webp'),
  },
  {
    id: '2',
    title: 'Create Content Instantly',
    description: 'Generate high-converting ads, engaging social posts, and SEO-optimized content in seconds with Claude AI.',
    icon: require('../../../assets/images/tool-icons-v2/copywriting.webp'),
  },
  {
    id: '3',
    title: 'Boost Your ROI',
    description: 'Our AI analyzes top-performing content to help you create marketing materials that convert.',
    icon: require('../../../assets/images/tool-icons-v2/growth-chart.webp'),
  },
  {
    id: '4',
    title: '7-Day Free Trial',
    description: 'Start creating amazing marketing content today. No credit card required to get started.',
    icon: require('../../../assets/images/tool-icons-v2/marketing-target.webp'),
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation<any>();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Auth');
    }
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={styles.slide}>
      <View style={styles.cardShadow}>
        <View style={styles.glassCard}>
          <View style={styles.iconGlow} />
          <Image source={item.icon} style={styles.icon3d} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <AnimatedBackground variant="default" showParticles={false}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={ONBOARDING_DATA}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
          }}
          keyExtractor={(item) => item.id}
        />

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {ONBOARDING_DATA.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  currentIndex === i ? styles.activeDot : null,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <LinearGradient colors={Gradients.button} style={styles.nextGradient}>
              <Text style={styles.nextText}>
                {currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started  \u2192' : 'Next  \u2192'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipBtn: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  skipText: { color: Colors.textSecondary, fontSize: 16, fontWeight: '500' },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  cardShadow: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 28,
    elevation: 12,
    marginBottom: 40,
  },
  glassCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(22,24,36,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  iconGlow: {
    position: 'absolute',
    width: ICON_SIZE + 20,
    height: ICON_SIZE + 20,
    borderRadius: (ICON_SIZE + 20) / 2,
    backgroundColor: 'rgba(124,58,237,0.15)',
    shadowColor: '#9D4EDD',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  icon3d: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  textContainer: { alignItems: 'center' },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeDot: { width: 24, backgroundColor: Colors.secondary },
  nextBtn: { width: '100%', height: 56, borderRadius: 28, overflow: 'hidden' },
  nextGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  nextText: { color: Colors.white, fontSize: 18, fontWeight: 'bold' },
});

export default OnboardingScreen;
