import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../services/api';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    navigate('/', { replace: true });
  }, [navigate]);

  const resetInactivityTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(logout, INACTIVITY_TIMEOUT);
  }, [logout]);

  useEffect(() => {
    if (isAuthenticated) {
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
      
      const handleUserActivity = () => {
        resetInactivityTimer();
      };

      events.forEach(event => {
        window.addEventListener(event, handleUserActivity);
      });

      resetInactivityTimer();

      return () => {
        events.forEach(event => {
          window.removeEventListener(event, handleUserActivity);
        });
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [isAuthenticated, resetInactivityTimer]);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token');
        }

        const response = await authApi.validateToken();
        if (response.data?.valid) {
          setIsAuthenticated(true);
          if (location.pathname === '/') {
            navigate('/dashboard', { replace: true });
          }
        } else {
          throw new Error('Invalid token');
        }
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [navigate, location.pathname]);

  const login = async (pin: string): Promise<void> => {
    try {
      const response = await authApi.login(pin);
      if (!response.data) {
        throw new Error('Login failed');
      }
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      resetInactivityTimer();
      navigate('/dashboard', { replace: true });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        login, 
        logout, 
        resetInactivityTimer 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};