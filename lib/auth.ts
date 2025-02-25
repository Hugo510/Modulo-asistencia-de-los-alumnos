import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as jose from 'jose';
import type { User, LoginCredentials, AuthResponse } from './types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  verifyResetToken: (token: string) => Promise<boolean>;
  updatePassword: (token: string, newPassword: string) => Promise<boolean>;
}

// Mock user for local testing
const MOCK_USER: User = {
  id: '1',
  firstName: 'Demo',
  lastName: 'Teacher',
  email: 'teacher@example.com',
  role: 'teacher',
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
};

// Create a secret key for JWT signing (in production this would be an environment variable)
const SECRET_KEY = new TextEncoder().encode(
  'your-256-bit-secret'
);

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (credentials: LoginCredentials) => {
        // Verify captcha token first
        if (!credentials.captchaToken) {
          throw new Error('Captcha verification required');
        }

        // In production, verify captcha token with hCaptcha API
        
        // Simple local validation
        if (credentials.email === 'teacher@example.com' && credentials.password === 'password123') {
          // Create JWT token
          const token = await new jose.SignJWT({ sub: MOCK_USER.id })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(SECRET_KEY);

          set({ 
            user: MOCK_USER, 
            token, 
            isAuthenticated: true 
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      resetPassword: async (email: string) => {
        // In production, this would send a reset email
        console.log('Password reset requested for:', email);
        return true;
      },
      verifyResetToken: async (token: string) => {
        try {
          await jose.jwtVerify(token, SECRET_KEY);
          return true;
        } catch {
          return false;
        }
      },
      updatePassword: async (token: string, newPassword: string) => {
        try {
          await jose.jwtVerify(token, SECRET_KEY);
          // In production, update password in database
          console.log('Password updated for token:', token);
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);