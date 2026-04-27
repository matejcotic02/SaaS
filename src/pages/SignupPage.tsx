import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  UserPlus,
  User,
  Building2,
  Mail,
  Lock,
} from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import {
  AuthInputWithIcon,
  CleanMinimalAuthCard,
} from "@/components/ui/clean-minimal-sign-in";
import { Input } from "@/components/ui/input";
import { PlasticButton } from "@/components/ui/plastic-button";
import { supabase } from "@/lib/supabase";

function mapAuthError(message: string): string {
  if (message.includes("User already registered")) {
    return "An account with this email already exists. Try signing in.";
  }
  if (
    message.includes("Password should be at least") ||
    message.includes("password")
  ) {
    return "Password must be at least 6 characters.";
  }
  if (message.includes("Invalid email")) {
    return "Please enter a valid email address.";
  }
  return message;
}

export function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [touched, setTouched] = useState({
    fullName: false,
    businessName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const fullNameError =
    touched.fullName && !fullName ? "Full name is required" : null;
  const businessNameError =
    touched.businessName && !businessName ? "Business name is required" : null;
  const emailError = touched.email && !email ? "Email is required" : null;
  const emailFormatError =
    touched.email && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Please enter a valid email address"
      : null;
  const passwordError =
    touched.password && !password ? "Password is required" : null;
  const passwordLengthError =
    touched.password && password && password.length < 6
      ? "Password must be at least 6 characters"
      : null;
  const confirmPasswordError =
    touched.confirmPassword && !confirmPassword
      ? "Please confirm your password"
      : null;
  const passwordMismatchError =
    touched.confirmPassword && confirmPassword && password !== confirmPassword
      ? "Passwords do not match"
      : null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    setTouched({
      fullName: true,
      businessName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!fullName || !businessName || !email || !password || !confirmPassword) {
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }

    if (password.length < 6) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            business_name: businessName,
          },
        },
      });

      if (error) {
        setError(mapAuthError(error.message));
        return;
      }

      if (data.session) {
        navigate("/dashboard");
        return;
      }

      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(
          "We couldn't sign you in automatically. In Supabase: Authentication → Providers → Email — disable Confirm email, then try Sign In."
        );
        return;
      }

      if (signInData.session) {
        navigate("/dashboard");
        return;
      }

      setError(
        "We couldn't start your session. Try signing in, or disable Confirm email in Supabase under Authentication → Providers → Email."
      );
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <CleanMinimalAuthCard
        icon={UserPlus}
        title="Create your CallBay account"
        subtitle="Start setting up your AI phone assistant."
        className="max-w-md"
      >
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <AuthInputWithIcon icon={User}>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                  error={!!fullNameError}
                  disabled={loading}
                  autoComplete="name"
                  className="pl-10"
                />
              </AuthInputWithIcon>
              {fullNameError && (
                <p className="text-xs text-red-400">{fullNameError}</p>
              )}
            </div>

            <div className="space-y-2">
              <AuthInputWithIcon icon={Building2}>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, businessName: true }))}
                  error={!!businessNameError}
                  disabled={loading}
                  autoComplete="organization"
                  className="pl-10"
                />
              </AuthInputWithIcon>
              {businessNameError && (
                <p className="text-xs text-red-400">{businessNameError}</p>
              )}
            </div>
          </div>

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
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() =>
                    setTouched((t) => ({ ...t, confirmPassword: true }))
                  }
                  error={!!(confirmPasswordError || passwordMismatchError)}
                  disabled={loading}
                  autoComplete="new-password"
                  className="pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </AuthInputWithIcon>
            {(confirmPasswordError || passwordMismatchError) && (
              <p className="text-xs text-red-400">
                {confirmPasswordError || passwordMismatchError}
              </p>
            )}
          </div>

          <PlasticButton
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="mt-2 w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </PlasticButton>

          <div className="mt-4 flex flex-col items-center gap-3 border-t border-[var(--border)] pt-6 text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary transition-colors hover:text-primary-hover"
              >
                Sign In
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
