import { useEffect, useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { X, Download, Smartphone, Globe, SmartphoneIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
  interface Navigator {
    standalone?: boolean;
  }
}

type Platform = 'android' | 'ios' | 'web';

const STORAGE_KEY = 'pwa-install-dismissed';
const DISMISS_DURATION_DAYS = 30; // Show prompt again after 30 days if dismissed

export function InstallPrompt() {
  const { t } = useTranslation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  // Check if app is running in standalone mode
  const isStandalone = useCallback((): boolean => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  }, []);

  // Check if prompt was previously dismissed
  const isDismissed = useCallback((): boolean => {
    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (!dismissedAt) return false;
    
    const daysSinceDismissal = 
      (Date.now() - new Date(dismissedAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceDismissal < DISMISS_DURATION_DAYS;
  }, []);

  // Detect platform and set up event listeners
  useEffect(() => {
    if (isStandalone() || isDismissed()) {
      return;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);

    if (isIos) {
      setPlatform('ios');
    } else if (isAndroid) {
      setPlatform('android');
    } else {
      setPlatform('web');
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    // Show prompt after a delay to avoid showing it too early
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 3000);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isStandalone, isDismissed]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      setIsInstalling(true);
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      // Log the user's choice (for analytics if needed)
      console.log(`User ${outcome} the install prompt`);
      
      // Hide the prompt
      handleDismiss();
    } catch (error) {
      console.error('Error during installation:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal timestamp
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case 'ios':
      case 'android':
        return <SmartphoneIcon className="h-5 w-5 text-primary" />;
      default:
        return <Globe className="h-5 w-5 text-primary" />;
    }
  };

  const getInstallInstructions = () => {
    switch (platform) {
      case 'ios':
        return t('install.ios', 'Tap the share icon and select "Add to Home Screen" to install this app');
      case 'android':
        return t('install.android', 'Install this app for a better experience with offline support');
      default:
        return t('install.web', 'Install this web app on your device for a better experience');
    }
  };

  // Don't show prompt if app is already installed or prompt is not ready
  if (isStandalone() || !showPrompt || !platform) {
    return null;
  }

  return (
    <div 
      className="fixed inset-x-0 bottom-0 z-50 bg-card border-t shadow-lg transition-transform duration-300 ease-in-out"
      data-testid="install-prompt"
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
              {getPlatformIcon()}
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">
                {t('install.title', 'Install App')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {getInstallInstructions()}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {platform !== 'ios' && (
              <Button 
                size="sm" 
                onClick={handleInstall}
                disabled={isInstalling}
                className="whitespace-nowrap"
              >
                {isInstalling ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">
                      <Download className="h-3 w-3" />
                    </span>
                    {t('common.installing', 'Installing...')}
                  </span>
                ) : (
                  t('common.install', 'Install')
                )}
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDismiss}
              className="text-xs"
            >
              {t('common.notNow', 'Not Now')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
