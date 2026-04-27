import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2, Lock } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import {
  AuthInputWithIcon,
  CleanMinimalAuthCard,
} from "@/components/ui/clean-minimal-sign-in";
import { Input } from "@/components/ui/input";
import { PlasticButton } from "@/components/ui/plastic-button";
import { supabase } from "@/lib/supabase";

function mapAuthError(message: string): string {
  if (message.includes("Password")) {
    return "Password does not meet requirements. Use at least 6 characters.";
  }
  if (message.includes("same as")) {
    return "Choose a password different from your current one.";
  }
  return message;
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ password: false, confirm: false });

  useEffect(() => {
    let cancelled = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (cancelled) return;
        if (session) {
          setReady(true);
          setChecking(false);
        }
      },
    );

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) {
        setReady(true);
        setChecking(false);
        return;
      }
      await new Promise((r) => setTimeout(r, 150));
      if (cancelled) return;
      const { data: { session: retry } } = await supabase.auth.getSession();
      if (retry) {
        setReady(true);
      }
      setChecking(false);
    };

    void init();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const passwordError =
    touched.password && !password ? "Password is required" : null;
  const passwordLengthError =
    touched.password && password && password.length < 6
      ? "Use at least 6 characters"
      : null;
  const confirmError =
    touched.confirm && !confirmPassword ? "Confirm your password" : null;
  const mismatchError =
    touched.confirm && password && confirmPassword && password !== confirmPassword
      ? "Passwords do not match"
      : null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setTouched({ password: true, confirm: true });

    if (!password || password.length < 6) return;
    if (password !== confirmPassword) return;

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });
      if (updateError) {
        setError(mapAuthError(updateError.message));
        return;
      }
      await supabase.auth.signOut();
      navigate("/login", { replace: true, state: { passwordReset: true } });
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Validating your reset link…</p>
        </div>
      </AuthLayout>
    );
  }

  if (!ready) {
    return (
      <AuthLayout>
        <CleanMinimalAuthCard
          icon={KeyRound}
          title="Link invalid or expired"
          subtitle="Request a new reset link to continue."
        >
          <div className="flex w-full flex-col items-center gap-4 text-sm">
            <p className="text-center text-muted-foreground">
              This page only works from the password email link. It may have expired.
            </p>
            <Link
              to="/forgot-password"
              className="font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Request a new link
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </div>
        </CleanMinimalAuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <CleanMinimalAuthCard
        icon={KeyRound}
        title="Choose a new password"
        subtitle="Enter and confirm your new password below."
      >
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <AuthInputWithIcon icon={Lock}>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  error={!!(passwordError || passwordLengthError)}
                  disabled={loading}
                  autoComplete="new-password"
                  className="pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </AuthInputWithIcon>
            {(passwordError || passwordLengthError) && (
              <p className="text-xs text-red-400">
                {passwordError || passwordLengthError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <AuthInputWithIcon icon={Lock}>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                  error={!!(confirmError || mismatchError)}
                  disabled={loading}
                  autoComplete="new-password"
                  className="pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </AuthInputWithIcon>
            {(confirmError || mismatchError) && (
              <p className="text-xs text-red-400">{confirmError || mismatchError}</p>
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
                Updating…
              </>
            ) : (
              "Update password"
            )}
          </PlasticButton>

          <div className="mt-4 flex flex-col items-center border-t border-[var(--border)] pt-6 text-sm">
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </div>
        </form>
      </CleanMinimalAuthCard>
    </AuthLayout>
  );
}
