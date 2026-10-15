import Link from "next/link";
import Reveal from "@/components/shared/motion/reveal";

export type AuthPage = "login" | "register" | "forgot-password" | "verify";

const LINKS: { page: AuthPage; href: string; prompt: string; label: string }[] =
  [
    {
      page: "login",
      href: "/login",
      prompt: "Already have an account?",
      label: "Log in",
    },
    {
      page: "register",
      href: "/register",
      prompt: "New here?",
      label: "Create an account",
    },
    {
      page: "forgot-password",
      href: "/forgot-password",
      prompt: "Can't sign in?",
      label: "Reset your password",
    },
  ];

// Footer of every auth page: links to the other auth pages (never the current one)
export default function AuthLinks({
  current,
  delay = 0.3,
}: {
  current: AuthPage;
  delay?: number;
}) {
  const links = LINKS.filter(({ page }) => page !== current);

  return (
    <Reveal delay={delay}>
      <nav
        aria-label="Account pages"
        className="flex flex-col items-center gap-2 border-t pt-6 text-sm text-muted-foreground"
      >
        {links.map(({ page, href, prompt, label }) => (
          <span key={page}>
            {prompt}{" "}
            <Link
              href={href}
              className="font-semibold text-primary hover:underline"
            >
              {label}
            </Link>
          </span>
        ))}
      </nav>
    </Reveal>
  );
}
