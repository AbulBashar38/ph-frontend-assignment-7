"use client";

import {
  ArrowRight,
  Building2,
  KeyRound,
  type LucideIcon,
  ShieldCheck,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Stagger, StaggerItem } from "@/components/shared/motion/stagger";
import { Spinner } from "@/components/ui/spinner";
import { useAuthRedirect, useLogin } from "@/hooks";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/utils";

export type DemoRole = "admin" | "tenant" | "owner";

export interface DemoAccount {
  role: DemoRole;
  email?: string;
  password?: string;
}

const ROLE_INFO: Record<
  DemoRole,
  { label: string; text: string; icon: LucideIcon }
> = {
  admin: {
    label: "Admin",
    text: "Moderate listings, users and payments",
    icon: ShieldCheck,
  },
  tenant: {
    label: "Tenant",
    text: "Search, match, apply and pay rent",
    icon: KeyRound,
  },
  owner: {
    label: "Owner",
    text: "List rooms and review applicants",
    icon: Building2,
  },
};

// One-click login as a demo account; ?demo=<role> (from the home page) highlights that card
export default function DemoLogin({ accounts }: { accounts: DemoAccount[] }) {
  const highlighted = useSearchParams().get("demo");
  const redirectAfterAuth = useAuthRedirect();
  const { mutate: login, isPending } = useLogin();
  const [activeRole, setActiveRole] = useState<DemoRole | null>(null);

  const handleDemoLogin = ({ role, email, password }: DemoAccount) => {
    if (!email || !password) return;

    setActiveRole(role);
    login(
      { email, password },
      {
        onSuccess: (res) => {
          toast.success(`Logged in as demo ${ROLE_INFO[role].label}`);
          redirectAfterAuth(res.data.user);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
          setActiveRole(null);
        },
      },
    );
  };

  return (
    <Stagger className="grid gap-3 sm:grid-cols-3" stagger={0.1}>
      {accounts.map((account) => {
        const { label, text, icon: Icon } = ROLE_INFO[account.role];
        const configured = Boolean(account.email && account.password);
        const loading = isPending && activeRole === account.role;

        return (
          <StaggerItem key={account.role} className="flex">
            <button
              type="button"
              disabled={!configured || isPending}
              onClick={() => handleDemoLogin(account)}
              className={cn(
                "group flex w-full flex-col items-start gap-3 rounded-2xl border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-60",
                highlighted === account.role &&
                  "border-primary ring-3 ring-primary/20",
              )}
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {loading ? <Spinner /> : <Icon className="size-5" />}
              </span>
              <span>
                <span className="flex items-center gap-1 font-semibold">
                  {label}
                  <ArrowRight className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {configured ? text : "Demo account not configured"}
                </span>
              </span>
            </button>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
