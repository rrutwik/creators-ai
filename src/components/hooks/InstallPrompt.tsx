import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { X, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function InstallPrompt() {
  const { t } = useTranslation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'web' | null>(null);

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;

  useEffect(() => {
    if (localStorage.getItem('pwa-install-dismissed')) setDismissed(true);
  }, []);

  useEffect(() => {
    if (isStandalone() || dismissed) return;

    const ua = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);

    if (isIos) {
      setPlatform('ios');
      setShowPrompt(true);
    } else if (isAndroid) {
      setPlatform('android');
    } else {
      setPlatform('web');
      setShowPrompt(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [dismissed]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('User response:', outcome);
    }
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt || isStandalone()) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-card border rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Download className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">{t('install.title')}</h3>
          <p className="text-xs text-muted-foreground mb-3">
            {platform === 'ios'
              ? 'Tap Share → Add to Home Screen to install this app'
              : platform === 'android'
              ? 'Install this app for a better experience'
              : 'Install this app for offline support and faster load'}
          </p>
          <div className="flex gap-2">
            {platform !== 'ios' && (
              <Button size="sm" onClick={handleInstall} className="text-xs">
                {t('common.install')}
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={handleDismiss} className="text-xs">
              {t('common.notNow')}
            </Button>
          </div>
        </div>
        <Button size="sm" variant="ghost" onClick={handleDismiss} className="flex-shrink-0 h-6 w-6 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
