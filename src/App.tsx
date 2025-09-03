import { useState, useEffect, useRef, useCallback, lazy } from 'react';
import { LoginPage } from './features/auth/components/LoginPage';
// import { InstallPrompt } from './components/hooks/InstallPrompt';
import { Toaster } from './components/ui/sonner';
import { getUserDetails, logout, updateProfile } from './services/api';
// import { registerServiceWorker, setupInstallPrompt } from './services/pwa';
import Cookies from 'js-cookie';
import type { User } from './types/interfaces';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import type { THEME_MODES } from './utils/consts';
import { LanguageSwitcher } from './components/hooks/LanguageSwitcher';
import { initGA, setUser as setAnalyticsUser, trackLogin, clearUser, trackThemeChange, trackLanguageChange, trackLogout as trackLogoutEvent } from './lib/analytics';
import ChatInterface from './features/chat/components/ChatInterface';
import { LazyLoadComponent } from './components/lazy/LazyLoadComponent';

export default function App() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<string>(i18n.language);
  const hasCheckedAuth = useRef(false);
  const [theme, setTheme] = useState<THEME_MODES>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved as THEME_MODES;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;
    const checkAuth = async () => {
      try {
        const userData = await getUserDetails(true);
        setUser(userData);
        const lng = userData.language || 'en';
        if (i18n.language !== lng) {
          void i18n.changeLanguage(lng);
        }
        // GA4: set user for restored sessions
        setAnalyticsUser({
          id: userData._id,
          email: userData.email,
          language: userData.language,
          first_name: userData.first_name,
          last_name: userData.last_name,
          credits: userData.credits,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.log('User not authenticated, removing cookies', error);
        setIsAuthenticated(false);
        Cookies.remove('session_token');
        Cookies.remove('refresh_token');
      }
    };

    checkAuth();
  }, []);

  // Initialize PWA functionality
  useEffect(() => {
    // registerServiceWorker();
    // setupInstallPrompt();
  }, []);

  // Apply theme to <html> and persist
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    // GA4: track theme change
    trackThemeChange(theme);
  }, [theme]);

  useEffect(() => {
    trackLanguageChange(language);
  }, [language]);

  const handleLogin = useCallback((userData: User) => {
    if (!userData) return;
    setUser(userData);
    if (userData?.language) {
      const lng = userData.language;
      if (i18n.language !== lng) {
        void i18n.changeLanguage(lng);
        // keep local state in sync + track
        setLanguage(lng);
        trackLanguageChange(lng);
      }
    } else {
      updateProfile({ language: i18n.language });
    }

    setIsAuthenticated(true);

    // GA4: login event + set user
    setAnalyticsUser({
      id: userData._id,
      email: userData.email,
      language: userData.language,
      first_name: userData.first_name,
      last_name: userData.last_name,
      credits: userData.credits,
    });
    trackLogin('google');
  }, []);

  const handleUserUpdated = useCallback((updated: any) => {
    setUser(updated);
    const lng = updated?.language || 'en';
    if (i18n.language !== lng) {
      void i18n.changeLanguage(lng);
      // keep local state in sync + track
      setLanguage(lng);
      trackLanguageChange(lng);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      console.log('handleLogout Removing cookies');
      Cookies.remove('session_token');
      Cookies.remove('refresh_token');
      clearUser();
      // GA4: track logout
      trackLogoutEvent();
    }
  }, []);

  useEffect(() => {
  }, [language, isAuthenticated]);

  // if (isAuthenticated === null) {
  //   return (
  //     <div className="min-h-screen bg-background flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
  //         <p className="text-muted-foreground">{t('common.loading')}</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-background">
      {!isAuthenticated && <LanguageSwitcher language={language} onChange={setLanguage} />}
      {isAuthenticated == false && (
        <LoginPage onLogin={handleLogin} />
      )}
      {isAuthenticated == true && (
        <LazyLoadComponent component={ChatInterface} user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme} language={language} />
      )}
      {/* <InstallPrompt /> */}
      <Toaster />
    </div>
  );
}