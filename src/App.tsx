import { useState, useEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { LoginPage } from "./features/auth/components/LoginPage";
import { Toaster } from "./components/ui/sonner";
import { getUserDetails, logout, updateProfile } from "./services/api";
import Cookies from "js-cookie";
import type { User } from "./types/interfaces";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import type { THEME_MODES } from "./utils/consts";
import { LanguageSwitcher } from "./components/hooks/LanguageSwitcher";
import {
  initGA,
  setUser as setAnalyticsUser,
  trackLogin,
  clearUser,
  trackThemeChange,
  trackLanguageChange,
  trackLogout as trackLogoutEvent,
} from "./lib/analytics";
import ChatInterface from "./features/chat/components/ChatInterface";
import { LazyLoadComponent } from "./components/lazy/LazyLoadComponent";
import { InstallPrompt } from "./components/hooks/InstallPrompt";
import AdminChatBot from "./features/admin/AdminChatBot";
import * as Sentry from "@sentry/react";

export default function App() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<string>(i18n.language);
  const hasCheckedAuth = useRef(false);
  const [theme, setTheme] = useState<THEME_MODES>(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved as THEME_MODES;
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
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
        const lng = userData.language || "en";
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
        console.log("User not authenticated, removing cookies", error);
        setIsAuthenticated(false);
        Cookies.remove("session_token");
        Cookies.remove("refresh_token");
      }
    };

    checkAuth();
  }, []);

  // Apply theme to <html> and persist
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
    // GA4: track theme change
    trackThemeChange(theme);
  }, [theme]);

  useEffect(() => {
    trackLanguageChange(language);
  }, [language]);

  const handleLogin = useCallback((userData: User) => {
    try {
      Sentry.captureEvent({
        message: 'Login successful',
        extra: {
          user,
        },
      });
      if (!userData) return;
      setUser(userData);
      Sentry.captureEvent({
        message: 'User set',
        extra: {
          user,
        },
      });
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
    trackLogin("google");
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        user,
      },
    });
    console.error("Login error:", error);
  }
  }, [user]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      console.log("handleLogout Removing cookies");
      Cookies.remove("session_token");
      Cookies.remove("refresh_token");
      clearUser();
      // GA4: track logout
      trackLogoutEvent();
    }
  }, []);

  useEffect(() => {
    // This effect can be used for any side effects related to language or auth changes
  }, [language, isAuthenticated]);

  // Loading component for authentication state
  const LoadingScreen = () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );

  // ProtectedRoute component for authenticated routes
  const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    if (isAuthenticated === null) {
      return <LoadingScreen />;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  };

  // AdminRoute component for admin-only routes
  const AdminRoute = ({ children }: { children: ReactNode }) => {
    if (isAuthenticated === null) {
      return <LoadingScreen />;
    }

    if (!isAuthenticated) {
      return (
        <Navigate to="/login" state={{ from: location.pathname }} replace />
      );
    }

    // Add additional admin role check here if needed
    // if (!user?.isAdmin) {
    //   return <Navigate to="/unauthorized" replace />;
    // }

    return <>{children}</>;
  };

  const AppContent = () => (
    <div className="min-h-screen bg-background">
      <InstallPrompt />
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <div className="min-h-screen bg-background">
                <LanguageSwitcher language={language} onChange={setLanguage} />
                <LoginPage onLogin={handleLogin} />
                <Toaster />
              </div>
            )
          }
        />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={
              <LazyLoadComponent
                component={ChatInterface}
                user={user}
                onLogout={handleLogout}
                theme={theme}
                setTheme={setTheme}
                language={language}
              />
            }
          />
          {/* Admin routes */}
          <Route
            element={
              <AdminRoute>
                <Outlet />
              </AdminRoute>
            }
          >
            <Route path="/admin/chatbot" element={
              <LazyLoadComponent
                component={AdminChatBot}
                user={user}
              />
            } />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </div>
  );

  // Wrap the app with Router at the root level
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
