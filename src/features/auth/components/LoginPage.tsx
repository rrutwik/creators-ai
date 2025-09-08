import { Card, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import Cookies from 'js-cookie';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useState } from 'react';
import { getUserDetails, loginWithGoogle } from '../../../services/api';
import { GoogleLoginComponent } from './GoogleLogin';
import { useTranslation } from 'react-i18next';
import type { User } from '../../../types/interfaces';
import * as Sentry from "@sentry/react";

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const { t, i18n } = useTranslation();
  const clientId = '201954194593-36t0nksh9jusg01k58et81ct27objt26.apps.googleusercontent.com';

  const handleLoginSuccess = async (response: any) => {
    try {
      const currentLanguage = i18n.language;
      const { data } = await loginWithGoogle({ ...response, language: currentLanguage });
      Cookies.set('session_token', data.sessionToken, { expires: 1 });
      Cookies.set('refresh_token', data.refreshToken, { expires: 1 });
      const user = await getUserDetails(true);
      console.log('Login successful:', user);
      Sentry.captureEvent({
        message: 'Login successful',
        extra: {
          user,
        },
      });
      onLogin(user);
    } catch (error) {
      console.error('Login failed:', error);
      Sentry.captureException(error, {
        extra: {
          response,
          error,
        },
      });
    }
  };

  const handleLoginError = (error: any) => {
    console.error('Login failed:', error);
    Sentry.captureEvent({
      message: 'Login failed',
      extra: {
        error,
      },
    });
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <span className="text-2xl">🙏</span>
            </div>
            <CardTitle className="text-2xl">{t('login.welcomeTitle')}</CardTitle>
            <CardDescription className="text-center">
              {t('login.welcomeDesc1')}
              <br />
              {t('login.welcomeDesc2')}
            </CardDescription>
          </CardHeader>
          <GoogleLoginComponent handleLoginSuccess={handleLoginSuccess} handleLoginError={handleLoginError} />
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
}