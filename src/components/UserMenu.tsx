"use client";

import { useState, useRef, useEffect } from "react";
import { loginAction, registerAction, logoutAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface UserMenuProps {
  user: {
    name?: string | null;
    role?: string;
  } | null;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    if (mode === "login") {
      const result = await loginAction(formData);
      if (!result.success) {
        setError(result.error || "Login failed");
      } else {
        setIsOpen(false);
        router.refresh();
      }
    } else {
      const result = await registerAction(formData);
      if (!result.success) {
        setError(result.error || "Registration failed");
      } else {
        setMode("login");
        setError("");
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await logoutAction();
    router.refresh();
  };

  if (user) {
    return (
      <div className="user-menu" ref={dropdownRef}>
        <button
          className="user-menu-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="user-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </span>
          <span className="user-name">{user.name}</span>
        </button>
        {isOpen && (
          <div className="user-dropdown">
            <div className="dropdown-info">
              <p className="dropdown-role">{user.role}</p>
            </div>
            <button className="dropdown-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="user-menu" ref={dropdownRef}>
      <button
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>Account</span>
      </button>

      {isOpen && (
        <div className="user-dropdown auth-dropdown">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => { setMode("login"); setError(""); }}
            >
              Login
            </button>
            <button
              className={`auth-tab ${mode === "register" ? "active" : ""}`}
              onClick={() => { setMode("register"); setError(""); }}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              name="login"
              type="text"
              placeholder="Login"
              required
              className="auth-input"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="auth-input"
            />
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "..." : mode === "login" ? "Sign In" : "Sign Up"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
