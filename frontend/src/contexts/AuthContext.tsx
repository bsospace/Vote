import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { mockUsers, User } from '../lib/mockData';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Retrieve user from localStorage on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Restore user from localStorage
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser)); // Store user in localStorage
      toast.success(`Welcome back, ${foundUser.name}!`);
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove user data from localStorage
    toast.success('Signed out successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin: user?.role === 'admin', 
      loading, 
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
