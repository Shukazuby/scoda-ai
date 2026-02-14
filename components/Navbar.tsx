"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AccountModal from "./AccountModal";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  credits: number;
}

export default function Navbar({ credits }: NavbarProps) {
  const pathname = usePathname();
  const {
    user,
    login,
    signup,
    logout,
    updateProfile,
    openAccountModal,
    closeAccountModal,
    accountModalOpen,
    accountModalView,
  } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "?";
  };

  return (
    <>
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/15 border border-primary-500/40 shadow-[0_0_22px_rgba(129,140,248,0.4)]">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-400/40 via-fuchsia-500/20 to-amber-400/30 blur-sm" />
                <div className="relative flex h-6 w-6 items-center justify-center rounded-lg bg-gray-950">
                  <span className="text-[14px] font-bold tracking-tight text-primary-300">
                    S
                  </span>
                </div>
              </div>
              <span className="text-xl font-semibold text-white tracking-tight">
                Scoda <span className="text-primary-300">AI</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Generator
              </Link>
              <Link
                href="/library"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("/library")
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Library
              </Link>
              <Link
                href="/insights"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("/insights")
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Insights
              </Link>
            </div>

            {/* Credits and User */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <svg
                  className="w-5 h-5 text-primary-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="text-sm font-medium">{credits} Credits</span>
              </div>
              <button
                onClick={() => openAccountModal()}
                className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm hover:ring-2 hover:ring-primary-400 transition-all cursor-pointer"
                aria-label="Account"
              >
                {getUserInitial()}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AccountModal
        isOpen={accountModalOpen}
        onClose={closeAccountModal}
        initialView={accountModalView}
        user={user}
        onLogin={login}
        onSignup={signup}
        onLogout={logout}
        onUpdateProfile={updateProfile}
      />
    </>
  );
}
