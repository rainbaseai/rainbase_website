'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  nickname?: string;
  email_verified?: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { 
    user: auth0User, 
    isLoading, 
    isAuthenticated, 
    error, 
    loginWithRedirect,
    logout: auth0Logout 
  } = useAuth0();

  const user: AuthUser | null = auth0User ? {
    id: auth0User.sub || '',
    name: auth0User.name || '',
    email: auth0User.email || '',
    picture: auth0User.picture,
    given_name: auth0User.given_name,
    family_name: auth0User.family_name,
    nickname: auth0User.nickname,
    email_verified: auth0User.email_verified,
  } : null;

  const login = () => {
    loginWithRedirect();
  };

  const logout = () => {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    error: error ?? null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}