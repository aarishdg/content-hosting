import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '../types';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        // Fetch user profile (role) from 'profiles' table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        if (profile) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            role: profile.role,
            created_at: data.user.created_at || '',
            updated_at: '',
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    getSession();
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getSession();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);


  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        throw new Error(error?.message || 'Invalid credentials');
      }
      // Fetch user profile (role)
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      if (profile) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          role: profile.role,
          created_at: data.user.created_at || '',
          updated_at: '',
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const register = async (email: string, password: string, role: 'contributor' | 'public'): Promise<void> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error || !data.user) {
        throw new Error(error?.message || 'Registration failed');
      }
      // Insert profile with selected role
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, email, role }]);
      if (profileError) {
        throw new Error(profileError.message);
      }
      setUser({
        id: data.user.id,
        email: data.user.email || '',
        role,
        created_at: data.user.created_at || '',
        updated_at: '',
      });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};