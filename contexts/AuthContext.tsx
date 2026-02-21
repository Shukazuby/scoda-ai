"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  apiLogin,
  apiSignup,
  apiGetCurrentUser,
  apiUpdateProfile,
  apiLogout,
  apiDeleteAccount,
  setAuthToken,
} from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  credits?: number;
}

export type AccountModalView = "login" | "signup" | null;

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  setUserCredits: (credits: number) => void;
  /** Open the account modal (e.g. from Navbar or when 401). Pass view to show login/signup tab. */
  openAccountModal: (view?: AccountModalView) => void;
  /** Close the account modal. */
  closeAccountModal: () => void;
  accountModalOpen: boolean;
  accountModalView: AccountModalView;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [accountModalView, setAccountModalView] = useState<AccountModalView>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("scoda_token");
    const storedUser = localStorage.getItem("scoda_user");

    if (storedToken) {
      setToken(storedToken);
      setAuthToken(storedToken);
    }

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as User;
        setUser(parsed);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("scoda_user");
      }
    }

    // Optional: verify token by fetching /auth/me
    (async () => {
      if (!storedToken) {
        setInitializing(false);
        return;
      }
      try {
        const me = await apiGetCurrentUser();
        setUser({
          id: me._id,
          name: me.name,
          email: me.email,
          credits: me.credits,
        });
      } catch (error) {
        console.warn("Stored token invalid, clearing auth state.", error);
        setUser(null);
        setToken(null);
        setAuthToken(null);
        localStorage.removeItem("scoda_user");
        localStorage.removeItem("scoda_token");
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const auth = await apiLogin(email, password);

    const nextUser: User = {
      id: auth.user._id,
      name: auth.user.name,
      email: auth.user.email,
      credits: auth.user.credits,
    };

    setUser(nextUser);
    setToken(auth.token);
    setAuthToken(auth.token);
    localStorage.setItem("scoda_user", JSON.stringify(nextUser));
    localStorage.setItem("scoda_token", auth.token);
  };

  const signup = async (name: string, email: string, password: string) => {
    const auth = await apiSignup(name, email, password);

    const nextUser: User = {
      id: auth.user._id,
      name: auth.user.name,
      email: auth.user.email,
    };

    setUser(nextUser);
    setToken(auth.token);
    setAuthToken(auth.token);
    localStorage.setItem("scoda_user", JSON.stringify(nextUser));
    localStorage.setItem("scoda_token", auth.token);
  };

  const logout = () => {
    // Fire and forget backend logout; local cleanup is primary source of truth.
    apiLogout().catch((error) =>
      console.warn("Logout request failed (ignored):", error)
    );

    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem("scoda_user");
    localStorage.removeItem("scoda_token");
  };

  const updateProfile = async (name: string, email: string) => {
    if (!user) throw new Error("Not authenticated");

    const updated = await apiUpdateProfile(name, email);

    const nextUser: User = {
      id: updated._id,
      name: updated.name,
      email: updated.email,
      credits: updated.credits ?? user.credits,
    };

    setUser(nextUser);
    localStorage.setItem("scoda_user", JSON.stringify(nextUser));
  };

  const deleteAccount = async () => {
    await apiDeleteAccount();
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem("scoda_user");
    localStorage.removeItem("scoda_token");
  };

  const setUserCredits = (credits: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, credits };
      localStorage.setItem("scoda_user", JSON.stringify(next));
      return next;
    });
  };

  const openAccountModal = (view?: AccountModalView) => {
    setAccountModalView(view ?? null);
    setAccountModalOpen(true);
  };

  const closeAccountModal = () => {
    setAccountModalOpen(false);
    setAccountModalView(null);
  };

  // While initializing (checking stored token), avoid flashing logged-out state
  if (initializing) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        updateProfile,
        deleteAccount,
        setUserCredits,
        openAccountModal,
        closeAccountModal,
        accountModalOpen,
        accountModalView,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
