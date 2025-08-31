// PWA utilities for service worker registration and install prompt

import { trackPWAInstallPromptShown, trackPWAInstallOutcome, trackPWAInstalled } from '../lib/analytics';

export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

export const checkForUpdates = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      registration.update();
    }
  }
};

// Install prompt functionality
let deferredPrompt: any = null;

export const setupInstallPrompt = (): void => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Show install button or banner
    showInstallPrompt();
    // Track that the prompt became available/shown
    trackPWAInstallPromptShown();
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    deferredPrompt = null;
    hideInstallPrompt();
    // Track successful installation
    trackPWAInstalled();
  });
};

export const showInstallPrompt = (): void => {
  // Dispatch custom event to show install button in UI
  window.dispatchEvent(new CustomEvent('pwa-install-available'));
};

export const hideInstallPrompt = (): void => {
  // Dispatch custom event to hide install button in UI
  window.dispatchEvent(new CustomEvent('pwa-install-completed'));
};

export const promptInstall = async (): Promise<void> => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    // Track outcome: 'accepted' | 'dismissed'
    trackPWAInstallOutcome(outcome);
    deferredPrompt = null;
  }
};

export const isStandalone = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};
