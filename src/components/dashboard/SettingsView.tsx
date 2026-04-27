import { useMemo, useState } from "react";
import {
  Copy,
  CreditCard,
  ExternalLink,
  KeyRound,
  Phone,
  RefreshCw,
  Save,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/shared/Toaster";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-foreground placeholder:text-neutral-500 transition-colors focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60";

const agentPhoneNumber = "+1 (302) 206-6446";

function getDisplayName(
  email: string | undefined,
  metadata: Record<string, unknown> | undefined,
): string {
  const fullName = metadata?.full_name;
  const name = metadata?.name;

  if (typeof fullName === "string" && fullName.trim()) return fullName.trim();
  if (typeof name === "string" && name.trim()) return name.trim();

  const local = email?.split("@")[0];
  return local ? local.charAt(0).toUpperCase() + local.slice(1) : "";
}

export function SettingsView() {
  const { user } = useAuth();

  const initialName = useMemo(
    () =>
      getDisplayName(
        user?.email,
        (user?.user_metadata ?? undefined) as Record<string, unknown> | undefined,
      ),
    [user],
  );

  const [fullName, setFullName] = useState(initialName);
  const [transferNumber, setTransferNumber] = useState("+1 (607) 379-4733");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const notifyPlaceholder = (title: string, description: string) => {
    toast(title, { description });
  };

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(agentPhoneNumber);
      toast("Phone number copied", {
        description: `${agentPhoneNumber} is ready to paste.`,
      });
    } catch {
      toast("Copy failed", {
        description: `Copy this number manually: ${agentPhoneNumber}`,
      });
    }
  };

  const handleSaveTransferNumber = () => {
    toast("Transfer number saved", {
      description: `Calls that need escalation will forward to ${transferNumber}.`,
    });
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      toast("Name is required", {
        description: "Please enter your full name before saving.",
      });
      return;
    }

    setSavingProfile(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName.trim() },
    });
    setSavingProfile(false);

    if (error) {
      toast("Profile update failed", { description: error.message });
      return;
    }

    toast("Profile saved", {
      description: "Your account information has been updated.",
    });
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 8) {
      toast("Password too short", {
        description: "Use at least 8 characters for your new password.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast("Passwords do not match", {
        description: "Confirm password must match the new password.",
      });
      return;
    }

    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setSavingPassword(false);

    if (error) {
      toast("Password update failed", { description: error.message });
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    toast("Password updated", {
      description: "Use your new password the next time you sign in.",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Settings
        </h1>
      </header>

      <section className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-base font-semibold text-foreground">
            Subscription & Billing
          </h2>
        </div>
        <p className="mt-1 text-sm text-neutral-400">
          Manage your subscription, update payment methods, or cancel your plan.
        </p>

        <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Current Plan
          </p>
          <p className="mt-1 text-sm text-foreground">
            CallBay <span className="text-neutral-500">|</span>{" "}
            <span className="font-semibold">$149/month</span>
          </p>
        </div>

        <div className="mt-5 text-sm text-neutral-300">
          <p className="font-medium text-foreground">
            Access the Stripe Customer Portal to:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-400">
            <li>Update your payment method</li>
            <li>View billing history and invoices</li>
            <li>Cancel or modify your subscription</li>
          </ul>
        </div>

        <Button
          variant="default"
          size="sm"
          className="mt-5"
          onClick={() =>
            notifyPlaceholder(
              "Billing portal is not connected yet",
              "A Stripe customer portal endpoint is needed before this can open.",
            )
          }
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          Manage Subscription
        </Button>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-base font-semibold text-foreground">
            Phone Numbers
          </h2>
        </div>
        <p className="mt-1 text-sm text-neutral-400">
          Set up your AI agent&apos;s phone line for customer calls.
        </p>

        <div className="mt-5 overflow-hidden rounded-xl border border-primary/25 bg-primary/5">
          <div className="border-b border-primary/15 px-4 py-3">
            <p className="flex items-center gap-2 text-sm font-medium text-primary">
              <Phone className="h-4 w-4" aria-hidden />
              Your AI Agent Phone Number
            </p>
          </div>
          <div className="flex flex-col gap-4 bg-card/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-xl font-semibold tracking-wide text-foreground">
              {agentPhoneNumber}
            </p>
            <Button variant="outline" size="sm" onClick={handleCopyNumber}>
              <Copy className="h-4 w-4" aria-hidden />
              Copy Number
            </Button>
          </div>
          <div className="grid gap-3 px-4 py-4 text-sm text-neutral-400 md:grid-cols-2">
            <div>
              <p className="font-medium text-foreground">Add this number to:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Your website contact page</li>
                <li>Facebook & Instagram</li>
                <li>Business cards & flyers</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Also add it to:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Google Business Profile</li>
                <li>Yelp & other directories</li>
                <li>Email signatures</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Calls Transfer To
          </p>
          <p className="mt-1 font-mono text-sm text-foreground">
            {transferNumber}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            When the AI needs to escalate, calls are forwarded here.
          </p>
        </div>

        <div className="mt-5 border-t border-white/5 pt-5">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              notifyPlaceholder(
                "Phone agent re-sync queued",
                "This is a placeholder until phone provider sync is connected.",
              )
            }
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Re-sync Phone Agent
          </Button>
          <p className="mt-2 text-xs text-neutral-500">
            Having issues with phone calls? Click to re-sync the agent status.
          </p>
        </div>

        <div className="mt-5 border-t border-white/5 pt-5">
          <label className="text-sm font-medium text-foreground">
            Outbound Call Transfer Number
          </label>
          <p className="mt-1 text-xs text-neutral-500">
            When the AI agent triggers a transfer during outbound calls, the call
            will be forwarded to this number.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="tel"
              value={transferNumber}
              onChange={(event) => setTransferNumber(event.target.value)}
              className={inputClass}
            />
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveTransferNumber}
              className="sm:w-auto"
            >
              Save
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-base font-semibold text-foreground">
            Profile Settings
          </h2>
        </div>
        <p className="mt-1 text-sm text-neutral-400">
          Manage your account information.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              value={user?.email ?? ""}
              disabled
              className={inputClass}
            />
            <p className="mt-2 text-xs text-neutral-500">
              Booking notifications will be sent to this email.
            </p>
          </div>
        </div>

        <Button
          variant="default"
          size="sm"
          className="mt-5"
          disabled={savingProfile}
          onClick={handleSaveProfile}
        >
          <Save className="h-4 w-4" aria-hidden />
          {savingProfile ? "Saving..." : "Save Changes"}
        </Button>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-base font-semibold text-foreground">
            Change Password
          </h2>
        </div>
        <p className="mt-1 text-sm text-neutral-400">
          Update your account password.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Enter new password"
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
              className={inputClass}
            />
          </div>
        </div>

        <Button
          variant="default"
          size="sm"
          className="mt-5"
          disabled={savingPassword}
          onClick={handleUpdatePassword}
        >
          {savingPassword ? "Updating..." : "Update Password"}
        </Button>
      </section>
    </div>
  );
}
