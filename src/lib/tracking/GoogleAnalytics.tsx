'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { trackingConfig } from '@/lib/tracking/config.tracking';

// Idle callback types

type IdleHandle = number;

export const scheduleIdle = (cb: () => void): IdleHandle => {
  if (typeof window === 'undefined') {
    return 0;
  }

  if ('requestIdleCallback' in window && typeof window.requestIdleCallback === 'function') {
    return window.requestIdleCallback(() => cb());
  }

  return window.setTimeout(cb, 500) as IdleHandle;
};

export const cancelIdle = (h: IdleHandle) => {
  if (typeof window === 'undefined') {
    return;
  }

  if ('cancelIdleCallback' in window && typeof window.cancelIdleCallback === 'function') {
    window.cancelIdleCallback(h);
    return;
  }

  clearTimeout(h);
};

// Gtag types
type GtagCommand = 'js' | 'config' | 'event' | 'consent' | 'set';
type GtagArgs = [GtagCommand, ...unknown[]];

interface WindowWithDataLayer extends Window {
  dataLayer?: unknown[];
}

// Helper for programmatic gtag calls (exported for use in other components)
export const gtag = (...args: GtagArgs) => {
  if (typeof window === 'undefined') return;
  const w = window as WindowWithDataLayer;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push(args);
};

export function GoogleAnalytics({ consented }: { consented: boolean }) {
  const [readyToLoad, setReadyToLoad] = useState(false);

  useEffect(() => {
    // Only schedule once we actually have consent
    if (!consented) return;

    const handle = scheduleIdle(() => {
      setReadyToLoad(true); // allowed: async callback
    });

    return () => cancelIdle(handle);
  }, [consented]);

  const shouldLoad = consented && readyToLoad;

  if (!shouldLoad) return null;

  const measurementId = trackingConfig.gtmId;

  return (
    <>
      {/* Load GA4 library */}
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />

      {/* Init GA4 + consent */}
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          // Consent mode (all granted since user consented before we load this)
          gtag('consent', 'update', {
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
            analytics_storage: 'granted',
          });

          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
