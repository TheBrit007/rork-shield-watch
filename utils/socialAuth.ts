import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

// Ensure web browser redirect is handled properly
WebBrowser.maybeCompleteAuthSession();

// Google Auth Configuration
// Note: In a real app, you would need to create OAuth credentials in Google Cloud Console
// and add them to your app.json or app.config.js
const GOOGLE_CLIENT_ID_ANDROID = 'YOUR_ANDROID_CLIENT_ID';
const GOOGLE_CLIENT_ID_IOS = 'YOUR_IOS_CLIENT_ID';
const GOOGLE_CLIENT_ID_WEB = 'YOUR_WEB_CLIENT_ID';

// Apple Auth Configuration
// Note: For Apple Sign In, you need to configure your app in the Apple Developer Portal
// and add the necessary configuration to your app.json or app.config.js

export interface SocialAuthResponse {
  success: boolean;
  userData?: {
    id: string;
    email?: string;
    name?: string;
    picture?: string;
    provider: 'google' | 'apple';
  };
  error?: string;
}

/**
 * Authenticate with Google
 */
export const signInWithGoogle = async (): Promise<SocialAuthResponse> => {
  try {
    // Configure Google auth request
    const [request, response, promptAsync] = Google.useAuthRequest({
      clientId: GOOGLE_CLIENT_ID_WEB,
      iosClientId: GOOGLE_CLIENT_ID_IOS,
      androidClientId: GOOGLE_CLIENT_ID_ANDROID,
      webClientId: GOOGLE_CLIENT_ID_WEB,
    });

    // Prompt user to authenticate
    const result = await promptAsync();

    if (result.type === 'success' && result.authentication) {
      // Get user info using the access token
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${result.authentication.accessToken}` },
        }
      );
      
      const userInfo = await userInfoResponse.json();
      
      return {
        success: true,
        userData: {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          provider: 'google',
        },
      };
    } else {
      return {
        success: false,
        error: 'Google sign in was cancelled or failed',
      };
    }
  } catch (error) {
    console.error('Google sign in error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
};

/**
 * Authenticate with Apple
 */
export const signInWithApple = async (): Promise<SocialAuthResponse> => {
  // Apple Sign In is only available on iOS
  if (Platform.OS !== 'ios') {
    return {
      success: false,
      error: 'Apple Sign In is only available on iOS devices',
    };
  }

  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // Apple Sign In successful
    return {
      success: true,
      userData: {
        id: credential.user,
        email: credential.email || undefined,
        name: credential.fullName?.givenName 
          ? `${credential.fullName.givenName} ${credential.fullName.familyName || ''}`
          : undefined,
        provider: 'apple',
      },
    };
  } catch (e) {
    // Handle error
    const error = e as Error;
    if ('code' in error && error.code === 'ERR_CANCELED') {
      return {
        success: false,
        error: 'Apple sign in was cancelled',
      };
    }
    
    console.error('Apple sign in error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
};