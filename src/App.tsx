import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { ChatInterface } from './components/ChatInterface';
import { InstallPrompt } from './components/InstallPrompt';
import { Toaster } from './components/ui/sonner';
import { getUserDetails, logout, updateProfile } from './utils/api';
import { registerServiceWorker, setupInstallPrompt } from './utils/pwa';
import Cookies from 'js-cookie';
import type { User } from './interfaces';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import type { THEME_MODES } from './utils/consts';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { initGA, setUser as setAnalyticsUser, trackLogin, clearUser } from './analytics';

export default function App() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = loading
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<string>(i18n.language);
  const [theme, setTheme] = useState<THEME_MODES>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved as THEME_MODES;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getUserDetails();
        setUser(userData.data);
        const lng = userData?.data?.language || 'en';
        if (i18n.language !== lng) {
          void i18n.changeLanguage(lng);
        }
        // GA4: set user for restored sessions
        setAnalyticsUser({
          id: (userData.data as any).id,
          email: userData.data.email,
          language: (userData.data as any).language,
          first_name: (userData.data as any).first_name,
          last_name: (userData.data as any).last_name,
          credits: (userData.data as any).credits,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.log('User not authenticated');
        setIsAuthenticated(false);
        Cookies.remove('session_token');
        Cookies.remove('refresh_token');
      }
    };

    checkAuth();
  }, []);

  // Initialize PWA functionality
  useEffect(() => {
    registerServiceWorker();
    setupInstallPrompt();
  }, []);

  // Initialize Google Analytics (react-ga4)
  useEffect(() => {
    initGA();
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
  }, [theme]);

  const handleLogin = (userData: any) => {
    setUser(userData.data);
    if (userData?.data?.language) {
      const lng = userData.data.language;
      if (i18n.language !== lng) {
        void i18n.changeLanguage(lng);
      }
    } else {
      updateProfile({ language: i18n.language });
    }
    
    setIsAuthenticated(true);

    // GA4: login event + set user
    trackLogin('google');
    setAnalyticsUser({
      id: (userData.data as any).id,
      email: userData.data.email,
      language: (userData.data as any).language,
      first_name: (userData.data as any).first_name,
      last_name: (userData.data as any).last_name,
      credits: (userData.data as any).credits,
    });
  };

  const handleUserUpdated = (updated: any) => {
    setUser(updated);
    const lng = updated?.language || 'en';
    if (i18n.language !== lng) {
      void i18n.changeLanguage(lng);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      // Clear tokens as fallback
      Cookies.remove('session_token');
      Cookies.remove('refresh_token');
      // GA4: clear user identity
      clearUser();
    }
  };

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {!isAuthenticated && <LanguageSwitcher language={language} onChange={setLanguage} />}
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <ChatInterface user={user} onLogout={handleLogout} onUserUpdated={handleUserUpdated} theme={theme} setTheme={setTheme} language={language} />
      )}
      <InstallPrompt />
      <Toaster />
    </div>
  );
}