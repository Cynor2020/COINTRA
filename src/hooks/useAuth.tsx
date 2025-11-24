import React, { createContext, useContext, useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  signup: (data: { name: string; email: string; password: string }) => Promise<boolean>;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('cointra_user');
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('cointra_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('cointra_user');
      }
    } catch (error) {
      // ignore sync issues
    }
  }, [user]);

  const signup = async ({ name, email, password }: { name: string; email: string; password: string }): Promise<boolean> => {
    const saved = JSON.parse(localStorage.getItem('cointra_users') || '[]');
    const exists = saved.find((entry: any) => entry.email === email);
    if (exists) {
      throw new Error('An account with this email already exists.');
    }

    const salt = bcrypt.genSaltSync(8);
    const hashed = bcrypt.hashSync(password, salt);

    const newUser = { id: Date.now(), name, email, password: hashed };
    saved.push(newUser);
    localStorage.setItem('cointra_users', JSON.stringify(saved));

    // Auto-login after signup
    setUser({ id: newUser.id, name: newUser.name, email: newUser.email });
    return true;
  };

  const login = async ({ email, password }: { email: string; password: string }): Promise<boolean> => {
    const saved = JSON.parse(localStorage.getItem('cointra_users') || '[]');
    const found = saved.find((entry: any) => entry.email === email);
    if (!found) {
      throw new Error('No account found for this email.');
    }

    const matches = bcrypt.compareSync(password, found.password);
    if (!matches) {
      throw new Error('Invalid credentials.');
    }

    setUser({ id: found.id, name: found.name, email: found.email });
    return true;
  };

  const logout = () => {
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}