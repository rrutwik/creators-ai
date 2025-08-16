import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { ChatInterface } from './components/ChatInterface';
import { Toaster } from './components/ui/sonner';
import { getUserDetails, logout } from './api';
import Cookies from 'js-cookie';
import type { User } from './interfaces';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = loading
  const [user, setUser] = useState<User | null>(null);

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getUserDetails();
        setUser(userData.data);
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

  const handleLogin = (userData: any) => {
    setUser(userData.data);
    setIsAuthenticated(true);
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
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <ChatInterface user={user} onLogout={handleLogout} />
      )}
      <Toaster />
    </div>
  );
}