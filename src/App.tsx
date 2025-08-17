import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { ChatInterface } from './components/ChatInterface';
import { InstallPrompt } from './components/InstallPrompt';
import { Toaster } from './components/ui/sonner';
import { getUserDetails, logout } from './utils/api';
import { registerServiceWorker, setupInstallPrompt } from './utils/pwa';
import Cookies from 'js-cookie';
import type { User } from './interfaces';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import { LanguageSwitcher } from './components/LanguageSwitcher';

export default function App() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = loading
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved as 'light' | 'dark';
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getUserDetails();
        setUser(userData.data);
        // Apply user preferred language if present
        const lng = userData?.data?.language || 'en';
        if (i18n.language !== lng) {
          void i18n.changeLanguage(lng);
        }
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

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const handleLogin = (userData: any) => {
    setUser(userData.data);
    const lng = userData?.data?.language || 'en';
    if (i18n.language !== lng) {
      void i18n.changeLanguage(lng);
    }
    setIsAuthenticated(true);
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
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 rounded-md border bg-card text-card-foreground px-3 py-2 text-sm shadow-sm hover:bg-accent hover:text-accent-foreground"
        aria-label={t('theme.' + (theme === 'dark' ? 'dark' : 'light'))}
      >
        {theme === 'dark' ? t('theme.dark') : t('theme.light')}
      </button>
      <LanguageSwitcher />
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <ChatInterface user={user} onLogout={handleLogout} onUserUpdated={handleUserUpdated} />
      )}
      <InstallPrompt />
      <Toaster />
    </div>
  );
}