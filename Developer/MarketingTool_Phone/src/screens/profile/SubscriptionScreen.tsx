import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Linking,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore, parseAppwriteResponse } from '../../store/authStore';
import { Colors, Gradients, Spacing, BorderRadius } from '../../constants/theme';
import * as Haptics from 'expo-haptics';
import { billingService } from '../../services/billingService';
import { functions } from '../../services/appwrite';
import { ExecutionMethod } from 'react-native-appwrite';

const { width } = Dimensions.get('window');

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyTotal: number;
  description: string;
  features: { text: string; included: boolean }[];
  popular?: boolean;
}

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const { profile, refreshProfile } = useAuthStore();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      billingService.initialize().catch(err => console.error('[Billing] Init failed:', err));
    }
    return () => {
      if (Platform.OS !== 'web') billingService.end().catch(() => {});
    };
  }, []);

  // Plans match marketingtool.pro/pricing/ exactly
  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free Trial',
      monthlyPrice: 0, yearlyPrice: 0, yearlyTotal: 0,
      description: '7-day trial, 3 generations/day',
      features: [
        { text: '7-day full access trial', included: true },
        { text: '3 generations per day', included: true },
        { text: 'Explore all 7 platforms', included: true },
        { text: 'Simulation mode enabled', included: true },
        { text: 'Priority support', included: false },
        { text: 'Real account connect', included: false },
      ],
    },
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 29, yearlyPrice: 17, yearlyTotal: 199,
      description: 'For solo marketers getting started',
      features: [
        { text: '200 generations/month', included: true },
        { text: 'Manual execution', included: true },
        { text: 'Standard reports', included: true },
        { text: 'Real account connect', included: true },
        { text: 'All 7 platforms included', included: true },
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 59, yearlyPrice: 42, yearlyTotal: 499,
      description: 'Connect Real Google & Meta Ads Data',
      popular: true,
      features: [
        { text: '500 generations/month', included: true },
        { text: 'Real Google/Meta Connection', included: true },
        { text: 'Performance Forecasting', included: true },
        { text: 'Advanced Automation', included: true },
        { text: 'Priority support', included: true },
      ],
    },
    {
      id: 'growth',
      name: 'Growth',
      monthlyPrice: 99, yearlyPrice: 83, yearlyTotal: 999,
      description: 'For agencies & large advertisers',
      features: [
        { text: '1,500+ generations/month', included: true },
        { text: 'Auto-apply rules (full automation)', included: true },
        { text: 'Predictive scaling AI', included: true },
        { text: 'Executive dashboards', included: true },
        { text: '24/7 Priority Support', included: true },
      ],
    },
    {
      id: 'agency',
      name: 'Agency',
      monthlyPrice: 0, yearlyPrice: 0, yearlyTotal: 0,
      description: 'White-label + dedicated AI optimization',
      features: [
        { text: 'Unlimited generations', included: true },
        { text: 'White-label solution', included: true },
        { text: 'Full API access', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'SLA + dedicated support', included: true },
      ],
    },
  ];

  type PlanId = 'free' | 'starter' | 'pro' | 'growth' | 'agency';

  // IAP Product IDs — MUST exactly match App Store Connect + Play Console.
  const PLAN_TO_SKU: Record<PlanId, { monthly: string; yearly: string } | null> = {
    free: null,
    starter: {
      monthly: 'pro.marketingtool.starter.monthly',
      yearly:  'pro.marketingtool.starter.yearly',
    },
    pro: {
      monthly: 'pro.marketingtool.pro.monthly',
      yearly:  'pro.marketingtool.pro.yearly',
    },
    growth: {
      monthly: 'pro.marketingtool.growth.monthly',
      yearly:  'pro.marketingtool.growth.yearly',
    },
    agency: null,
  };

  const handlePurchase = async (sku: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const userId = profile?.userId || profile?.$id;
    if (!userId) {
      Alert.alert('Sign In Required', 'Please sign in before making a purchase.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await billingService.requestPurchase(sku, userId!);
      if (result.success) {
        Alert.alert('Success', 'Your account has been topped up!', [
          { text: 'OK', onPress: () => { refreshProfile(); } },
        ]);
      } else if (result.error !== 'Purchase cancelled') {
        Alert.alert('Purchase Failed', result.error || 'Could not complete the purchase.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not process purchase.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const userId = profile?.userId || profile?.$id;
    if (!userId && selectedPlan !== 'free' && selectedPlan !== 'agency') {
      Alert.alert('Sign In Required', 'Please sign in before subscribing.');
      return;
    }

    if (selectedPlan === 'free') {
      Alert.alert('Free Trial Active', 'You have 7 days, 3 generations/day in simulation mode.');
      navigation.goBack();
      return;
    }

    if (selectedPlan === 'agency') {
      Linking.openURL('mailto:help@marketingtool.pro?subject=Agency%20Plan%20Inquiry');
      return;
    }

    setIsLoading(true);
    try {
      const skuInfo = PLAN_TO_SKU[selectedPlan as PlanId];
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        if (!skuInfo) {
          Alert.alert('Unavailable', 'This plan is not available in the mobile app.');
          return;
        }
        const sku = billingPeriod === 'monthly' ? skuInfo.monthly : skuInfo.yearly;
        const result = await billingService.requestPurchase(sku, userId!);
        if (result.success) {
          Alert.alert('Success', 'Your subscription is now active!', [
            { text: 'OK', onPress: () => { refreshProfile(); navigation.goBack(); } },
          ]);
          return;
        }
        if (result.error === 'Purchase cancelled') return;
        Alert.alert('Purchase Failed', result.error || 'Could not complete the purchase. Please try again.');
        return;
      }

      // Web-only checkout logic (for other platforms or testing)
      if (Platform.OS === 'web') {
        const userEmail = (profile as any)?.email || '';
        const execution = await functions.createExecution(
          'iap-verify',
          JSON.stringify({
            planId: selectedPlan,
            billingPeriod,
            userId,
            userEmail,
            platform: Platform.OS,
          }),
          false, '/', ExecutionMethod.POST,
        );
        const result = parseAppwriteResponse(execution.responseBody);
        if (result.url) {
          await Linking.openURL(result.url);
        } else {
          Alert.alert('Checkout Error', result.error || result.message || 'Could not start checkout.');
        }
      }    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not open checkout.');
    } finally { setIsLoading(false); }
  };

  const handleManageSubscription = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('itms-apps://apps.apple.com/account/subscriptions');
    } else if (Platform.OS === 'android') {
      Linking.openURL('https://play.google.com/store/account/subscriptions');
    } else {
      Linking.openURL('https://marketingtool.pro/account/billing');
    }
  };

  const handleRestorePurchases = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Supported', 'Restore Purchases is only available on iOS and Android.');
      return;
    }
    const userId = profile?.userId || profile?.$id;
    if (!userId) {
      Alert.alert('Sign In Required', 'Please sign in before restoring purchases.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await billingService.restorePurchases(userId);
      if (result.success) {
        Alert.alert('Restored', `${result.count ?? 0} purchase(s) restored.`, [
          { text: 'OK', onPress: () => { refreshProfile(); navigation.goBack(); } },
        ]);
      } else {
        Alert.alert('Nothing to Restore', result.error || 'No previous purchases found for this Apple ID / Google account.');
      }
    } catch (err: any) {
      Alert.alert('Restore Failed', err.message || 'Could not restore purchases.');
    } finally { setIsLoading(false); }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtnLeft} onPress={() => navigation.goBack()}>
        <View style={styles.closeBtnBg}>
          <Feather name="chevron-left" size={24} color="#FFF" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <View style={styles.closeBtnBg}>
          <Feather name="x" size={22} color="#FFF" />
        </View>
      </TouchableOpacity>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Rich Hero Header (NO JPEG) */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['rgba(124, 58, 237, 0.2)', 'rgba(13, 15, 28, 0)']}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroLeft}>
                <View style={styles.trialBadge}>
                  <Feather name="zap" size={12} color="#F59E0B" />
                  <Text style={styles.trialBadgeText}>7-Day Free Trial Available</Text>
                </View>
                <Text style={styles.heroTitle}>Scale Your Marketing with AI</Text>
                <Text style={styles.heroSub}>Generate ad copy, SEO content, emails & campaigns on demand.</Text>
              </View>
              <View style={styles.heroRight}>
                <Image 
                  source={require('../../../assets/images/tool-icons-v2/trophy.webp')} 
                  style={styles.heroIcon} 
                  resizeMode="contain" 
                />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Trust Stats Bar — only verifiable facts */}
        <View style={styles.trustStatsBar}>
          <View style={styles.trustStat}>
            <Text style={styles.trustStatValue}>130+</Text>
            <Text style={styles.trustStatLabel}>AI Tools</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustStat}>
            <Text style={styles.trustStatValue}>7-Day</Text>
            <Text style={styles.trustStatLabel}>Free Trial</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustStat}>
            <Text style={styles.trustStatValue}>Cancel</Text>
            <Text style={styles.trustStatLabel}>Anytime</Text>
          </View>
        </View>

        {/* Billing Toggle */}
        <View style={styles.billingWrap}>
          <View style={styles.billingToggle}>
            <TouchableOpacity
              style={[styles.billingOpt, billingPeriod === 'monthly' && styles.billingOptActive]}
              onPress={() => { Haptics.selectionAsync(); setBillingPeriod('monthly'); }}
            >
              <Text style={[styles.billingText, billingPeriod === 'monthly' && styles.billingTextActive]}>Monthly</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.billingOpt, billingPeriod === 'yearly' && styles.billingOptActive]}
              onPress={() => { Haptics.selectionAsync(); setBillingPeriod('yearly'); }}
            >
              <Text style={[styles.billingText, billingPeriod === 'yearly' && styles.billingTextActive]}>Yearly</Text>
              <View style={styles.saveBadge}><Text style={styles.saveBadgeText}>Save 44%</Text></View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plans */}
        <View style={styles.plansWrap}>
          {plans.map((plan) => {
            const selected = selectedPlan === plan.id;
            const isAgency = plan.id === 'agency';
            const isYearly = billingPeriod === 'yearly';
            // Savings = monthly*12 - yearly total
            const savings = plan.monthlyPrice > 0 ? (plan.monthlyPrice * 12) - plan.yearlyTotal : 0;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, selected && styles.planCardSelected]}
                onPress={() => { Haptics.selectionAsync(); setSelectedPlan(plan.id); }}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>BEST VALUE</Text>
                  </View>
                )}
                <View style={styles.planTop}>
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected && <View style={styles.radioInner} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planDesc}>{plan.description}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    {plan.id === 'free' ? (
                      <Text style={styles.planPrice}>$0<Text style={{fontSize: 14}}>/free</Text></Text>
                    ) : isAgency ? (
                      <Text style={styles.planPrice}>Custom</Text>
                    ) : isYearly ? (
                      <>
                        <Text style={styles.planPrice}>${plan.yearlyPrice}<Text style={{fontSize: 14}}>/mo</Text></Text>
                        <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>${plan.yearlyTotal}/year</Text>
                      </>
                    ) : (
                      <Text style={styles.planPrice}>${plan.monthlyPrice}<Text style={{fontSize: 14}}>/mo</Text></Text>
                    )}
                  </View>
                </View>
                {isYearly && !isAgency && savings > 0 && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, marginLeft: 36 }}>
                    <Feather name="tag" size={11} color="#22C55E" />
                    <Text style={{ fontSize: 12, color: '#22C55E', fontWeight: '700' }}>Save ${savings}/year</Text>
                  </View>
                )}
                <View style={styles.featList}>
                  {plan.features.map((f, i) => (
                    <View key={i} style={styles.featRow}>
                      <Feather name={f.included ? 'check' : 'x'} size={14} color={f.included ? '#22C55E' : 'rgba(255,255,255,0.3)'} />
                      <Text style={[styles.featText, !f.included && { color: 'rgba(255,255,255,0.4)', textDecorationLine: 'line-through' }]}>{f.text}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Apple 3.1.1: no Consumable IAP for tokens registered yet. Render card only on Android (Play has SKU "tokens" — 100 Extra Generations product, active in 173 countries) to avoid "misleading UI" rejection on iOS. */}
        <TouchableOpacity 
          style={{ paddingHorizontal: 20, marginTop: 28 }}
          onPress={() => handlePurchase('tokens')}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 22, fontWeight: '900', color: '#FFF', marginBottom: 6 }}>Need More Generations?</Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
            Buy extra tokens anytime when you reach your monthly limit.
          </Text>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
            <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>100 AI Tools</Text>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 }}>Added instantly to your account</Text>
            </View>
            <Text style={{ color: '#A78BFA', fontSize: 22, fontWeight: '900' }}>$3</Text>
          </View>
        </TouchableOpacity>

        {/* Restore + Manage — Apple 3.1.1 / Google Play Billing policy */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 24 }}>
          <TouchableOpacity onPress={handleRestorePurchases} disabled={isLoading}>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecorationLine: 'underline' }}>
              {isLoading ? 'Restoring…' : 'Restore Purchases'}
            </Text>
          </TouchableOpacity>
          {Platform.OS !== 'web' && (
            <TouchableOpacity onPress={handleManageSubscription}>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecorationLine: 'underline' }}>
                Manage Subscription
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Required legal disclosure for auto-renewable subscriptions */}
        {Platform.OS !== 'web' && (
          <Text style={styles.legalText}>
            Payment will be charged to your {Platform.OS === 'ios' ? 'Apple ID' : 'Google Play'} account at confirmation of purchase. Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period. Manage or cancel in your account settings.
          </Text>
        )}

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.subBtn} onPress={handleSubscribe} disabled={isLoading}>
          <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.subBtnGrad}>
            {isLoading ? <ActivityIndicator color="#FFF" /> : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="zap" size={18} color="#FFF" />
                <Text style={styles.subBtnText}>Subscribe Now</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.secureText}>Cancel anytime. Secure payment via Store.</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 8 }}>
          <TouchableOpacity onPress={() => Linking.openURL('https://marketingtool.pro/terms')}>
            <Text style={{ fontSize: 11, color: '#71717A', textDecorationLine: 'underline' }}>Terms of Use</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://marketingtool.pro/privacy')}>
            <Text style={{ fontSize: 11, color: '#71717A', textDecorationLine: 'underline' }}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0F1C' },
  closeBtn: { position: 'absolute', top: 56, right: 20, zIndex: 10 },
  backBtnLeft: { position: 'absolute', top: 56, left: 20, zIndex: 10 },
  closeBtnBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  heroSection: { height: 240, backgroundColor: '#0D0F1C' },
  heroGradient: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', paddingTop: 40 },
  heroContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroLeft: { flex: 1 },
  heroRight: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center' },
  heroIcon: { width: 120, height: 120 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 8, lineHeight: 32 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 20 },
  trustStatsBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(22, 24, 36, 0.7)', marginHorizontal: 20, marginTop: -24, paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  trustStat: { flex: 1, alignItems: 'center' },
  trustStatValue: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  trustStatLabel: { fontSize: 10, fontWeight: '600', color: '#A1A1AA', textTransform: 'uppercase', marginTop: 2 },
  trustDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.08)' },
  trialBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(245,158,11,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginBottom: 12, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.2)' },
  trialBadgeText: { fontSize: 11, fontWeight: '700', color: '#F59E0B', textTransform: 'uppercase' },
  billingWrap: { alignItems: 'center', paddingTop: 40, paddingBottom: 16 },
  billingToggle: { flexDirection: 'row', backgroundColor: 'rgba(22, 24, 36, 0.55)', padding: 3, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  billingOpt: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 11, flexDirection: 'row', alignItems: 'center', gap: 6 },
  billingOptActive: { backgroundColor: '#7C3AED' },
  billingText: { color: '#A1A1AA', fontWeight: '600', fontSize: 14 },
  billingTextActive: { color: '#FFF' },
  saveBadge: { backgroundColor: 'rgba(34,197,94,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  saveBadgeText: { fontSize: 10, color: '#22C55E', fontWeight: 'bold' },
  plansWrap: { paddingHorizontal: 20, gap: 12 },
  planCard: { backgroundColor: '#161824', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  planCardSelected: { borderColor: '#7C3AED', backgroundColor: 'rgba(124,58,237,0.05)' },
  popularBadge: { backgroundColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 12 },
  popularText: { fontSize: 10, fontWeight: '900', color: '#000' },
  planTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  radioSelected: { borderColor: '#7C3AED' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#7C3AED' },
  planName: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  planDesc: { fontSize: 12, color: '#A1A1AA', marginTop: 2 },
  planPrice: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  featList: { marginTop: 20, gap: 10 },
  featRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featText: { fontSize: 14, color: '#D4D4D8' },
  legalText: { fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 16, paddingHorizontal: 24, marginTop: 16, textAlign: 'center' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: 40, paddingTop: 20, backgroundColor: 'rgba(13,15,28,0.95)', borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  subBtn: { borderRadius: 16, overflow: 'hidden', height: 56 },
  subBtnGrad: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  subBtnText: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  secureText: { textAlign: 'center', marginTop: 12, fontSize: 12, color: '#71717A' },
});

export default SubscriptionScreen;