import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ArrowLeft, LogIn, Mail, Lock } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import {
  AuthInputWithIcon,
  CleanMinimalAuthCard,
} from "@/components/ui/clean-minimal-sign-in";
import { Input } from "@/components/ui/input";
import { PlasticButton } from "@/components/ui/plastic-button";
import { supabase } from "@/lib/supabase";

function mapAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Invalid email or password.";
  }
  if (message.includes("Email not confirmed")) {
    return "Please confirm your email before signing in.";
  }
  if (message.includes("Invalid email")) {
    return "Please enter a valid email address.";
  }
  return message;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError = touched.email && !email ? "Email is required" : null;
  const emailFormatError =
    touched.email && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Please enter a valid email address"
      : null;
  const passwordError =
    touched.password && !password ? "Password is required" : null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setTouched({ email: true, password: true });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setTouched({ email: true, password: true });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(mapAuthError(error.message));
        return;
      }

      navigate("/dashboard");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <CleanMinimalAuthCard
        icon={LogIn}
        title="Welcome back"
        subtitle="Sign in to manage your calls, leads, and bookings."
      >
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <AuthInputWithIcon icon={Mail}>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                error={!!(emailError || emailFormatError)}
                disabled={loading}
                autoComplete="email"
                className="pl-10"
              />
            </AuthInputWithIcon>
            {(emailError || emailFormatError) && (
              <p className="text-xs text-red-400">
                {emailError || emailFormatError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <AuthInputWithIcon icon={Lock}>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  error={!!passwordError}
                  disabled={loading}
                  autoComplete="current-password"
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
            {passwordError && (
              <p className="text-xs text-red-400">{passwordError}</p>
            )}
          </div>

          <div className="flex justify-end">
            <span
              className="cursor-not-allowed text-xs font-medium text-muted-foreground opacity-60"
              title="Password reset coming soon"
            >
              Forgot password?
            </span>
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
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </PlasticButton>

          <div className="mt-4 flex flex-col items-center gap-3 border-t border-[var(--border)] pt-6 text-sm">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary transition-colors hover:text-primary-hover"
              >
                Create Account
              </Link>
            </p>
            <Link
              to="/"
              className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Link>
          </div>
        </form>
      </CleanMinimalAuthCard>
    </AuthLayout>
  );
}
