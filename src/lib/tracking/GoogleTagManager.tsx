'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { trackingConfig } from '@/lib/tracking/config.tracking';

// Idle helper
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

// Safe wrapper
const gtag = (...args: GtagArgs) => {
  const w = window as WindowWithDataLayer;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push(args);
};

export function GoogleTagManager({ consented }: { consented: boolean }) {
  const [readyToLoad, setReadyToLoad] = useState(false);

  useEffect(() => {
    if (!consented) {
      return;
    }
    const h = scheduleIdle(() => setReadyToLoad(true));
    return () => cancelIdle(h);
  }, [consented]);

  const shouldLoad = consented && readyToLoad;

  if (!shouldLoad) return null;

  return (
    <>
      {/* Required GTM bootstrap — this MUST run BEFORE we load gtm.js */}
      <Script id="gtm-bootstrap" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
          });
        `}
      </Script>

      {/* Load GTM AFTER layer is initialized */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtm.js?id=${trackingConfig.gtmId}`}
        onLoad={() => {
          gtag('consent', 'update', {
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
            analytics_storage: 'granted',
          });
        }}
      />

      {/* NoScript fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${trackingConfig.gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
