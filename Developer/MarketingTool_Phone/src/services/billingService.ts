import { Platform } from 'react-native';
import * as IAP from 'react-native-iap';
import { functions } from './appwrite';
import { ExecutionMethod } from 'react-native-appwrite';
import { parseAppwriteResponse } from '../store/authStore';

export type PlanId = 'free' | 'starter' | 'pro' | 'growth' | 'agency';

export const PLAN_TO_SKU: Record<Exclude<PlanId, 'free' | 'agency'>, { monthly: string; yearly: string }> = {
  starter: { monthly: 'pro.marketingtool.starter.monthly', yearly: 'pro.marketingtool.starter.yearly' },
  pro:     { monthly: 'pro.marketingtool.pro.monthly',     yearly: 'pro.marketingtool.pro.yearly' },
  growth:  { monthly: 'pro.marketingtool.growth.monthly',  yearly: 'pro.marketingtool.growth.yearly' },
};

const SUBSCRIPTION_SKUS = new Set(
  Object.values(PLAN_TO_SKU).flatMap(p => [p.monthly, p.yearly])
);
const CONSUMABLE_SKUS = ['tokens'];

const iapAvailable = (): boolean => {
  try {
    return !!(IAP && typeof (IAP as any).initConnection === 'function');
  } catch { return false; }
};

const IAP_UNAVAILABLE_ERROR = 'In-app purchase is not available on this device.';

let initPromise: Promise<boolean> | null = null;

export const billingService = {
  async initialize() {
    if (!iapAvailable()) return false;
    if (initPromise) return initPromise;
    initPromise = (async () => {
      try {
        await IAP.initConnection();
        return true;
      } catch (err) {
        console.error('[Billing] Init error:', err);
        initPromise = null;
        return false;
      }
    })();
    return initPromise;
  },

  async getProducts() {
    if (!iapAvailable()) return [];
    try {
      const subSkus = [...SUBSCRIPTION_SKUS];
      const prodSkus = [...CONSUMABLE_SKUS];

      const [subscriptions, products] = await Promise.all([
        subSkus.length > 0
          ? IAP.fetchProducts({ skus: subSkus, type: 'subs' })
          : Promise.resolve([]),
        prodSkus.length > 0
          ? IAP.fetchProducts({ skus: prodSkus, type: 'in-app' })
          : Promise.resolve([]),
      ]);

      return [...(products || []), ...(subscriptions || [])];
    } catch (err) {
      console.error('[Billing] Fetch products error:', err);
      return [];
    }
  },

  async requestPurchase(sku: string, userId: string) {
    if (!iapAvailable()) {
      return { success: false, error: IAP_UNAVAILABLE_ERROR };
    }
    try {
      await this.initialize();
      const available = await this.getProducts();
      if (__DEV__) console.log('[Billing] Available products:', available.map((p: any) => p.id || p.productId));
      const found = available.find((p: any) => (p.id || p.productId) === sku);
      if (!found) {
        console.error('[Billing] Product not found in store:', sku, 'Available:', available.map((p: any) => p.id || p.productId));
        const reason = available.length === 0
          ? 'Subscription products are not yet available. Please try again in a few minutes.'
          : `This subscription is not available right now. Please contact support.`;
        return { success: false, error: reason };
      }

      const isSub = SUBSCRIPTION_SKUS.has(sku);
      const requestArgs: any = isSub
        ? {
            request: {
              apple: { sku },
              google: { skus: [sku] },
            },
            type: 'subs',
          }
        : {
            request: {
              apple: { sku },
              google: { skus: [sku] },
            },
            type: 'in-app',
          };

      const result = await IAP.requestPurchase(requestArgs);
      let purchase = Array.isArray(result) ? result[0] : result;
      if (purchase) {
        return await this.verifyPurchase(purchase, userId);
      }
      return { success: false, error: 'Purchase cancelled' };
    } catch (err: any) {
      console.error('[Billing] Purchase error:', err);
      return { success: false, error: err.message };
    }
  },

  async verifyPurchase(purchase: IAP.Purchase, userId: string) {
    if (!iapAvailable()) return { success: false, error: IAP_UNAVAILABLE_ERROR };
    try {
      const p = purchase as any;
      const payload: Record<string, unknown> = {
        userId,
        productId: p.productId || p.id,
        platform: Platform.OS,
      };
      if (Platform.OS === 'android') {
        payload.googlePurchaseToken = p.purchaseToken;
      } else {
        payload.appleReceipt = p.jwsRepresentationIOS || p.transactionReceipt;
        payload.transactionId = p.transactionId;
      }

      const execution = await functions.createExecution(
        'iap-verify',
        JSON.stringify(payload),
        false, '/', ExecutionMethod.POST
      );

      const result = parseAppwriteResponse(execution.responseBody);

      // CRITICAL iOS FIX: ALWAYS finish the transaction in Sandbox/Prod to prevent the queue from locking up.
      // If we don't finish it, the next purchase attempt will immediately fail or get stuck.
      if (Platform.OS === 'ios') {
        try {
          await IAP.finishTransaction({
            purchase,
            isConsumable: !SUBSCRIPTION_SKUS.has(p.productId || p.id),
          });
        } catch (e) {
          console.warn('[Billing] Failed to finish iOS transaction:', e);
        }
      }

      if (result.success) {
        if (Platform.OS === 'android' && p.purchaseToken) {
          await IAP.acknowledgePurchaseAndroid(p.purchaseToken);
        }
        return { success: true };
      }

      return { success: false, error: result.error || 'Verification failed' };
    } catch (err: any) {
      console.error('[Billing] Verification error:', err);
      return { success: false, error: err.message };
    }
  },

  async restorePurchases(userId: string) {
    if (!iapAvailable()) return { success: false, error: IAP_UNAVAILABLE_ERROR };
    try {
      const purchases = await IAP.getAvailablePurchases();
      if (!purchases || purchases.length === 0) {
        return { success: false, error: 'No purchases found to restore.' };
      }
      const results = await Promise.allSettled(
        purchases.map((p) => this.verifyPurchase(p, userId))
      );
      const successCount = results.filter(
        (r) => r.status === 'fulfilled' && r.value.success
      ).length;
      return { success: successCount > 0, count: successCount };
    } catch (err: any) {
      console.error('[Billing] Restore error:', err);
      return { success: false, error: err.message };
    }
  },

  async end() {
    if (!iapAvailable()) return;
    try { await IAP.endConnection(); } catch { /* noop */ }
  }
};
