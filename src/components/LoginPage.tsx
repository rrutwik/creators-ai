import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import Cookies from 'js-cookie';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useState } from 'react';
import { getUserDetails, loginWithGoogle } from '../api';
import { GoogleLoginComponent } from './login/GoogleLogin';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const clientId = '201954194593-36t0nksh9jusg01k58et81ct27objt26.apps.googleusercontent.com';

  const handleLoginSuccess = async (response: any) => {
    try {
      const { data } = await loginWithGoogle(response);
      Cookies.set('session_token', data.sessionToken, { expires: 1 });
      Cookies.set('refresh_token', data.refreshToken, { expires: 1 });
      const user = await getUserDetails();
      onLogin(user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLoginError = (error: any) => {
    console.error('Login failed:', error);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <span className="text-2xl">🙏</span>
            </div>
            <CardTitle className="text-2xl">Welcome to CreatorsAI</CardTitle>
            <CardDescription className="text-center">
              Connect with divine wisdom from different religious traditions.
              Chat with AI representations of religious figures for guidance and spiritual insights.
            </CardDescription>
          </CardHeader>
          <GoogleLoginComponent handleLoginSuccess={handleLoginSuccess} handleLoginError={handleLoginError} />
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
}