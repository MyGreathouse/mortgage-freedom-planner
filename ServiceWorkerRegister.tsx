'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    const eligible =
      'serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || window.location.hostname === 'localhost');

    if (!eligible) {
      console.log(
        'Service worker skipped — offline caching only activates once this app is hosted over HTTPS (or localhost). This has no effect on the app itself.'
      );
      return;
    }

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('Service worker registration failed:', err);
      });
    });
  }, []);

  return null;
}
