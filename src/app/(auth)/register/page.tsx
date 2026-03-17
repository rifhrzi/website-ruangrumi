"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
  bgColor: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1)
    return {
      score: 1,
      label: "Weak",
      color: "bg-red-500",
      bgColor: "text-red-600",
    };
  if (score <= 2)
    return {
      score: 2,
      label: "Fair",
      color: "bg-orange-400",
      bgColor: "text-orange-600",
    };
  if (score <= 3)
    return {
      score: 3,
      label: "Good",
      color: "bg-yellow-400",
      bgColor: "text-yellow-600",
    };
  if (score <= 4)
    return {
      score: 4,
      label: "Strong",
      color: "bg-green-500",
      bgColor: "text-green-600",
    };
  return {
    score: 5,
    label: "Very Strong",
    color: "bg-emerald-500",
    bgColor: "text-emerald-600",
  };
}

export default function RegisterPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const passwordStrength = useMemo(
    () => (form.password ? getPasswordStrength(form.password) : null),
    [form.password],
  );

  const validators: Record<string, (value: string) => string | undefined> =
    useMemo(
      () => ({
        name: (value: string) => {
          if (!value.trim()) return "Full name is required";
          if (value.trim().length < 2)
            return "Name must be at least 2 characters";
          return undefined;
        },
        email: (value: string) => {
          if (!value.trim()) return "Email is required";
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            return "Please enter a valid email address";
          return undefined;
        },
        phone: (value: string) => {
          if (!value.trim()) return "Phone number is required";
          if (!/^(\+62|62|0)[\d\s-]{8,15}$/.test(value.replace(/\s/g, "")))
            return "Please enter a valid Indonesian phone number";
          return undefined;
        },
        password: (value: string) => {
          if (!value) return "Password is required";
          if (value.length < 8) return "Password must be at least 8 characters";
          return undefined;
        },
        confirmPassword: (value: string) => {
          if (!value) return "Please confirm your password";
          if (value !== form.password) return "Passwords do not match";
          return undefined;
        },
      }),
      [form.password],
    );

  const updateField = useCallback(
    (field: keyof FormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (touched[field] && validators[field]) {
        setErrors((prev) => ({ ...prev, [field]: validators[field](value) }));
      }
      // Re-validate confirm password when password changes
      if (field === "password" && touched.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: form.confirmPassword
            ? value !== form.confirmPassword
              ? "Passwords do not match"
              : undefined
            : "Please confirm your password",
        }));
      }
    },
    [touched, validators, form.confirmPassword],
  );

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (validators[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validators[field](form[field as keyof FormData]),
      }));
    }
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    (Object.keys(validators) as (keyof FormData)[]).forEach((field) => {
      newErrors[field] = validators[field](form[field]);
    });
    if (!agreeTerms) {
      newErrors.terms = "You must agree to the terms and privacy policy";
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  }, [form, agreeTerms, validators]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allFields = Object.keys(validators);
    setTouched(
      allFields.reduce(
        (acc, field) => ({ ...acc, [field]: true }),
        {} as Record<string, boolean>,
      ),
    );

    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    // TODO: Integrate with actual auth API
    console.log("Register:", { ...form, agreeTerms });
  };

  const inputFields: {
    id: keyof FormData;
    label: string;
    type: string;
    placeholder: string;
    icon: React.ElementType;
    autoComplete: string;
    isPassword?: boolean;
    showToggle?: boolean;
    show?: boolean;
    onToggle?: () => void;
  }[] = [
    {
      id: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
      icon: User,
      autoComplete: "name",
    },
    {
      id: "email",
      label: "Email Address",
      type: "email",
      placeholder: "you@example.com",
      icon: Mail,
      autoComplete: "email",
    },
    {
      id: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "08xx xxxx xxxx",
      icon: Phone,
      autoComplete: "tel",
    },
    {
      id: "password",
      label: "Password",
      type: showPassword ? "text" : "password",
      placeholder: "Create a strong password",
      icon: Lock,
      autoComplete: "new-password",
      isPassword: true,
      showToggle: true,
      show: showPassword,
      onToggle: () => setShowPassword(!showPassword),
    },
    {
      id: "confirmPassword",
      label: "Confirm Password",
      type: showConfirmPassword ? "text" : "password",
      placeholder: "Re-enter your password",
      icon: Lock,
      autoComplete: "new-password",
      isPassword: true,
      showToggle: true,
      show: showConfirmPassword,
      onToggle: () => setShowConfirmPassword(!showConfirmPassword),
    },
  ];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg gradient-coffee flex items-center justify-center">
            <User className="w-4 h-4 text-gold-400" />
          </div>
          <span className="text-sm font-medium text-coffee-400 tracking-wide uppercase">
            Get Started
          </span>
        </div>
        <h1 className="text-3xl font-bold text-brown-900 tracking-tight">
          Create Account
        </h1>
        <p className="text-coffee-400 text-base">
          Join the Ruang Rumi experience
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {inputFields.map((field) => {
          const Icon = field.icon;
          const hasError = touched[field.id] && errors[field.id];

          return (
            <div key={field.id} className="space-y-1.5">
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-brown-700">
                {field.label}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Icon
                    className={cn(
                      "h-4.5 w-4.5 transition-colors",
                      hasError ? "text-red-400" : "text-coffee-300",
                    )}
                  />
                </div>
                <input
                  id={field.id}
                  type={field.type}
                  value={form[field.id]}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  onBlur={() => handleBlur(field.id)}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  className={cn(
                    "block w-full rounded-xl border bg-white py-3 pl-11 text-sm text-brown-900 placeholder:text-coffee-300/70 transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-offset-1",
                    field.showToggle ? "pr-11" : "pr-4",
                    hasError
                      ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                      : "border-cream-300 hover:border-coffee-200 focus:border-coffee-400 focus:ring-coffee-200",
                  )}
                />
                {field.showToggle && (
                  <button
                    type="button"
                    onClick={field.onToggle}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-coffee-300 hover:text-coffee-500 transition-colors"
                    tabIndex={-1}
                    aria-label={field.show ? "Hide password" : "Show password"}>
                    {field.show ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                )}
              </div>

              {/* Password strength indicator */}
              {field.id === "password" && form.password && passwordStrength && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-all duration-300",
                          i < passwordStrength.score
                            ? passwordStrength.color
                            : "bg-cream-200",
                        )}
                      />
                    ))}
                  </div>
                  <p
                    className={cn(
                      "text-xs font-medium",
                      passwordStrength.bgColor,
                    )}>
                    {passwordStrength.label}
                  </p>
                </div>
              )}

              {hasError && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                  {errors[field.id]}
                </p>
              )}
            </div>
          );
        })}

        {/* Terms & Privacy */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-start gap-2.5">
            <button
              type="button"
              role="checkbox"
              aria-checked={agreeTerms}
              onClick={() => {
                setAgreeTerms(!agreeTerms);
                if (errors.terms) {
                  setErrors((prev) => ({ ...prev, terms: undefined }));
                }
              }}
              className={cn(
                "mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-all duration-200",
                agreeTerms
                  ? "border-coffee-500 bg-coffee-500"
                  : "border-cream-300 bg-white hover:border-coffee-300",
              )}>
              {agreeTerms && (
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
              onClick={() => {
                setAgreeTerms(!agreeTerms);
                if (errors.terms) {
                  setErrors((prev) => ({ ...prev, terms: undefined }));
                }
              }}
              className="text-sm text-brown-700 cursor-pointer select-none leading-relaxed">
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-medium text-coffee-500 hover:text-coffee-600 underline underline-offset-2"
                onClick={(e) => e.stopPropagation()}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-coffee-500 hover:text-coffee-600 underline underline-offset-2"
                onClick={(e) => e.stopPropagation()}>
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="text-xs text-red-500 ml-7 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
              {errors.terms}
            </p>
          )}
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
              Creating account...
            </span>
          ) : (
            "Create Account"
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

      {/* Social signup */}
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

      {/* Sign in link */}
      <p className="text-center text-sm text-coffee-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-coffee-500 hover:text-coffee-600 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
