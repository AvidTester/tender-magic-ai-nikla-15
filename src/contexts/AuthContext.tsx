
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

// Define user roles
export type UserRole = 'admin' | 'vendor' | 'evaluator';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API URL - Using dynamic hostname but with configurable port (could be moved to env variable)
const API_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for stored user and token on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          // Verify token is still valid with the backend
          const response = await fetch(`${API_URL}/users/verify-token`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            setUser(JSON.parse(storedUser));
          } else {
            // If token verification fails, clear storage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.warn("Could not verify token, but continuing with stored user data");
          // Even if verification fails due to network, still use stored user for better UX
          setUser(JSON.parse(storedUser));
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function - optimized for better performance
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        // Adding timeout to prevent long waits
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Transform the API response to match our User interface
        const userData: User = {
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role as UserRole,
          avatar: data.avatar,
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);
        setIsLoading(false);
        return true;
      } else {
        console.error('Login failed:', data);
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive"
        });
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Connection Error",
        description: "Could not connect to authentication server. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Add toast notification for logout
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
