"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = useCallback((value: string): string | undefined => {
    if (!value.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Please enter a valid email address";
    return undefined;
  }, []);

  const validatePassword = useCallback((value: string): string | undefined => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return undefined;
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  }, [email, password, validateEmail, validatePassword]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    }
    if (field === "password") {
      setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    // TODO: Integrate with actual auth API
    console.log("Login:", { email, password, rememberMe });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-6">
          <Coffee className="w-5 h-5 text-coffee-500" />
          <span className="text-sm font-medium text-coffee-400 tracking-wide uppercase">
            Welcome Back
          </span>
        </div>
        <h1 className="text-3xl font-bold text-brown-900 tracking-tight">
          Sign in to your account
        </h1>
        <p className="text-coffee-400 text-base">
          Access your Ruang Rumi experience
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-brown-700">
            Email Address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Mail
                className={cn(
                  "h-4.5 w-4.5 transition-colors",
                  touched.email && errors.email
                    ? "text-red-400"
                    : "text-coffee-300",
                )}
              />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) {
                  setErrors((prev) => ({
                    ...prev,
                    email: validateEmail(e.target.value),
                  }));
                }
              }}
              onBlur={() => handleBlur("email")}
              placeholder="you@example.com"
              autoComplete="email"
              className={cn(
                "block w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-brown-900 placeholder:text-coffee-300/70 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-offset-1",
                touched.email && errors.email
                  ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                  : "border-cream-300 hover:border-coffee-200 focus:border-coffee-400 focus:ring-coffee-200",
              )}
            />
          </div>
          {touched.email && errors.email && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-brown-700">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-coffee-500 hover:text-coffee-600 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Lock
                className={cn(
                  "h-4.5 w-4.5 transition-colors",
                  touched.password && errors.password
                    ? "text-red-400"
                    : "text-coffee-300",
                )}
              />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (touched.password) {
                  setErrors((prev) => ({
                    ...prev,
                    password: validatePassword(e.target.value),
                  }));
                }
              }}
              onBlur={() => handleBlur("password")}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={cn(
                "block w-full rounded-xl border bg-white py-3 pl-11 pr-11 text-sm text-brown-900 placeholder:text-coffee-300/70 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-offset-1",
                touched.password && errors.password
                  ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                  : "border-cream-300 hover:border-coffee-200 focus:border-coffee-400 focus:ring-coffee-200",
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-coffee-300 hover:text-coffee-500 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
          {touched.password && errors.password && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            role="checkbox"
            aria-checked={rememberMe}
            onClick={() => setRememberMe(!rememberMe)}
            className={cn(
              "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-all duration-200",
              rememberMe
                ? "border-coffee-500 bg-coffee-500"
                : "border-cream-300 bg-white hover:border-coffee-300",
            )}>
            {rememberMe && (
              <svg
                className="h-3 w-3 text-white"
                viewBox="0 0 12 12"
                fill="none">
                <path
                  d="M2 6l3 3 5-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <label
            onClick={() => setRememberMe(!rememberMe)}
            className="text-sm text-brown-700 cursor-pointer select-none">
            Remember me
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full rounded-xl bg-coffee-500 py-3 px-4 text-sm font-semibold text-white transition-all duration-200",
            "hover:bg-coffee-600 focus:outline-none focus:ring-2 focus:ring-coffee-300 focus:ring-offset-2",
            "active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100",
          )}>
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                viewBox="0 0 24 24"
                fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-cream-300" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-cream-50 px-4 text-coffee-300 font-medium">
            or continue with
          </span>
        </div>
      </div>

      {/* Social login */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center gap-2.5 rounded-xl border border-cream-300 bg-white py-2.5 px-4",
            "text-sm font-medium text-brown-800 transition-all duration-200",
            "hover:bg-cream-100 hover:border-coffee-200 focus:outline-none focus:ring-2 focus:ring-coffee-200 focus:ring-offset-1",
            "active:scale-[0.98]",
          )}>
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center gap-2.5 rounded-xl border border-cream-300 bg-white py-2.5 px-4",
            "text-sm font-medium text-brown-800 transition-all duration-200",
            "hover:bg-cream-100 hover:border-coffee-200 focus:outline-none focus:ring-2 focus:ring-coffee-200 focus:ring-offset-1",
            "active:scale-[0.98]",
          )}>
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          Apple
        </button>
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm text-coffee-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-coffee-500 hover:text-coffee-600 transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}
