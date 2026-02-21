"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AccountModal from "./AccountModal";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  credits: number;
}

const NAV_LINKS = [
  { href: "/", label: "Generator" },
  { href: "/library", label: "Library" },
  { href: "/insights", label: "Insights" },
] as const;

export default function Navbar({ credits }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu on route change or when viewport grows to md+
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => {
      if (mq.matches) setMobileMenuOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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

            {/* Navigation Links - desktop */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(href)
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right: credits + mobile menu button (mobile) | credits + account (desktop) */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2 text-white">
                <svg
                  className="w-5 h-5 text-primary-400 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="text-sm font-medium whitespace-nowrap">{credits} Credits</span>
              </div>
              {/* Mobile: hamburger only (account moves into menu) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/80 transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" aria-hidden />
                ) : (
                  <Menu className="w-6 h-6" aria-hidden />
                )}
              </button>
              {/* Desktop: account button */}
              <button
                onClick={() => openAccountModal()}
                className="hidden md:flex w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full items-center justify-center text-white font-semibold text-sm hover:ring-2 hover:ring-primary-400 transition-all cursor-pointer shrink-0"
                aria-label="Account"
              >
                {getUserInitial()}
              </button>
            </div>
          </div>

          {/* Mobile menu panel */}
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            aria-hidden={!mobileMenuOpen}
            className={`md:hidden overflow-hidden transition-[height,opacity] duration-200 ease-out ${
              mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-gray-800 py-4 px-2 flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(href)
                      ? "text-white bg-gray-800/80"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                  }`}
                >
                  {label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAccountModal();
                }}
                className="px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors text-left flex items-center gap-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-semibold text-sm">
                  {getUserInitial()}
                </span>
                Account
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
