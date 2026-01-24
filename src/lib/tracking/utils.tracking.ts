/// src/libs/tracking/utils.tracking.ts
'use client';

import { IS_GTM_ENABLED, trackingConfig } from './config.tracking';
import { type Gtag, type GtagEvent } from '@/types/tracking.types';

const logGAWarning = (message: string) => {
  console.warn(`[Tracking] Warning: ${message}`);
};

interface WindowWithGtag extends Window {
  gtag?: Gtag.Gtag;
  dataLayer?: unknown[];
}

// Always returns a callable gtag function.
// - If GTM is disabled → no-op function.
// - If real window.gtag exists → use it.
// - Otherwise → shim that pushes into dataLayer (safe before GTM loads).
const getGtag = (): Gtag.Gtag => {
  if (typeof window === 'undefined') {
    logGAWarning('Window is undefined – returning noop gtag');
    // SSR / non-browser: no-op

    return (() => {}) as Gtag.Gtag;
  }

  if (!IS_GTM_ENABLED) {
    logGAWarning('Google Analytics is not enabled – returning noop gtag');

    return (() => {}) as Gtag.Gtag;
  }

  const w = window as WindowWithGtag;

  if (typeof w.gtag === 'function') {
    return w.gtag;
  }

  // Fallback: create / reuse dataLayer and return shim
  logGAWarning('GTag does not exist yet – using dataLayer shim');

  w.dataLayer = w.dataLayer ?? [];

  const shim: Gtag.Gtag = ((...args: unknown[]) => {
    w.dataLayer?.push(args);
  }) as Gtag.Gtag;

  return shim;
};

const withGtag = (callback: (gtag: Gtag.Gtag) => void) => {
  const gtag = getGtag();
  callback(gtag);
};

export const sendGAEvent = (event: GtagEvent) =>
  withGtag((gtag) => {
    gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  });

export const grantConsentForEverything = () =>
  withGtag((gtag) => {
    gtag('consent', 'update', {
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      ad_storage: 'granted',
      analytics_storage: 'granted',
    });
  });

export const revokeConsentForEverything = () =>
  withGtag((gtag) => {
    gtag('consent', 'update', {
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      ad_storage: 'denied',
      analytics_storage: 'denied',
    });
  });

export const markFeatureUsage = (feature: string) =>
  performance.mark('mark_feature_usage', {
    detail: { feature },
  });

export const pageview = (url: string) =>
  withGtag((gtag) => {
    gtag('config', trackingConfig.gtmId, {
      page_path: url,
    });
  });
