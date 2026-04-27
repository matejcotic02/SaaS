import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, KeyRound, Loader2, Mail } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import {
  AuthInputWithIcon,
  CleanMinimalAuthCard,
} from "@/components/ui/clean-minimal-sign-in";
import { Input } from "@/components/ui/input";
import { PlasticButton } from "@/components/ui/plastic-button";
import { supabase } from "@/lib/supabase";

function mapAuthError(message: string): string {
  if (message.includes("Invalid email")) {
    return "Please enter a valid email address.";
  }
  return message;
}

/** Add this URL in Supabase: Auth → URL Configuration → Redirect URLs */
export function getPasswordResetRedirectUrl() {
  return `${window.location.origin}/reset-password`;
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState(false);

  const emailError = touched && !email ? "Email is required" : null;
  const emailFormatError =
    touched && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Please enter a valid email address"
      : null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setTouched(true);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: getPasswordResetRedirectUrl() },
      );
      if (resetError) {
        setError(mapAuthError(resetError.message));
        return;
      }
      setSent(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <CleanMinimalAuthCard
        icon={KeyRound}
        title="Reset your password"
        subtitle="We will email you a link to choose a new password."
      >
        {sent ? (
          <div className="flex w-full flex-col gap-4 text-center text-sm text-muted-foreground">
            <p>
              If an account exists for <span className="text-foreground">{email}</span>, you will
              receive a reset link shortly. Check your inbox and spam folder.
            </p>
            <Link
              to="/login"
              className="font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <AuthInputWithIcon icon={Mail}>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  error={!!(emailError || emailFormatError)}
                  disabled={loading}
                  autoComplete="email"
                  className="pl-10"
                />
              </AuthInputWithIcon>
              {(emailError || emailFormatError) && (
                <p className="text-xs text-red-400">{emailError || emailFormatError}</p>
              )}
            </div>

            <PlasticButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="mt-1 w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending link...
                </>
              ) : (
                "Send reset link"
              )}
            </PlasticButton>

            <div className="mt-4 flex flex-col items-center gap-3 border-t border-[var(--border)] pt-6 text-sm">
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </CleanMinimalAuthCard>
    </AuthLayout>
  );
}
