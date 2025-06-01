
import { createContext, useContext, useEffect, useState } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { callEdgeFunction } from "@/utils/api";

type User = SupabaseUser & {
  name?: string;
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  login: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Function to send login notification
  const sendLoginNotification = async (userEmail: string, userName?: string) => {
    try {
      await callEdgeFunction('send-login-notification', {
        email: userEmail,
        name: userName,
        timestamp: new Date().toISOString(),
      });
      console.log('Login notification sent successfully');
    } catch (error) {
      console.error('Error sending login notification:', error);
    }
  };
  
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Send notification when user logs in
        if (event === 'SIGNED_IN' && newSession?.user) {
          const userEmail = newSession.user.email;
          const userName = newSession.user.user_metadata?.first_name;
          
          if (userEmail) {
            // Use setTimeout to avoid blocking the auth state change
            setTimeout(() => {
              sendLoginNotification(userEmail, userName);
            }, 0);
          }
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return result;
  };

  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return result;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const resetPassword = async (email: string) => {
    const result = await supabase.auth.resetPasswordForEmail(email);
    return result;
  };

  const login = async () => {
    navigate('/auth');
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ? { ...user, name: user.user_metadata?.first_name || 'User' } : null,
        session,
        signUp,
        signIn,
        signOut,
        resetPassword,
        login,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
