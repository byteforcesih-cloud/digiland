import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, LanguageCode } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email_or_phone: string, password: string) => Promise<void>;
  logout: () => void;
  updateLanguagePreference: (lang: LanguageCode) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('digiland_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('digiland_token');
      if (storedToken) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (err) {
          console.error("Session verification failed:", err);
          localStorage.removeItem('digiland_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email_or_phone: string, password: string) => {
    setIsLoading(true);
    try {
      const authData = await authService.login(email_or_phone, password);
      localStorage.setItem('digiland_token', authData.access_token);
      setToken(authData.access_token);
      const profile = await authService.getProfile();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('digiland_token');
    setToken(null);
    setUser(null);
  };

  const updateLanguagePreference = (lang: LanguageCode) => {
    if (user) {
      setUser({ ...user, preferred_language: lang });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        updateLanguagePreference
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
