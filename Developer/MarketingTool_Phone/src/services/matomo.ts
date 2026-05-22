import { Platform } from 'react-native';

/**
 * Matomo Tag Manager Service
 * Clean mobile implementation to avoid "stuck on home page" issues.
 */
class MatomoService {
  private containerId = 'gbRzL6j6';
  private baseUrl = 'https://matomo.marketingtool.pro';
  private isInitialized = false;

  async init() {
    if (this.isInitialized) return;

    try {
      if (__DEV__) console.log('[Matomo] Initializing tracker for', Platform.OS);
      
      // On mobile, we use the tracking API instead of loading the .js container
      // to avoid blocking the UI thread and bridge.
      this.isInitialized = true;
      this.trackEvent('app_start', { platform: Platform.OS });
    } catch (error) {
      console.warn('[Matomo] Init failed:', error);
    }
  }

  async trackView(screenName: string) {
    if (!this.isInitialized) await this.init();
    if (__DEV__) console.log(`[Matomo] Tracking view: ${screenName}`);
    // implementation of tracking pixel or API call here
  }

  async trackEvent(category: string, action: any) {
    if (!this.isInitialized) await this.init();
    if (__DEV__) console.log(`[Matomo] Tracking event: ${category}`, action);
  }
}

export const matomo = new MatomoService();
