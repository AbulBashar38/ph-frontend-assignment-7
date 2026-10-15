"use client";

import {
  Building2,
  ChevronDown,
  Compass,
  Home,
  Info,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Mail,
  Menu,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth, useLogout } from "@/hooks";
import { cn } from "@/lib/utils";
import { getDashboardPath } from "@/utils";

const NAV_LINKS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Properties", href: "/properties", icon: Building2 },
  { name: "Rooms", href: "/rooms", icon: Compass },
  { name: "About Us", href: "/about", icon: Info },
  { name: "Services", href: "/services", icon: Sparkles },
  { name: "Contact", href: "/contact", icon: Mail },
  { name: "FAQ", href: "/faq", icon: LifeBuoy },
];

export default function Header() {
  const pathname = usePathname();
  const { user, role, isLoading } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
      },
      onError: () => {
        toast.error("Logout failed. Please try again.");
      },
    });
  };

  const getRoleBadgeVariant = (userRole?: string) => {
    switch (userRole) {
      case "SUPER_ADMIN":
      case "ADMIN":
        return "destructive";
      case "OWNER":
        return "default";
      case "TENANT":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:-rotate-6">
            <Building2 className="size-5" />
          </span>
          <span className="font-heading text-xl font-bold tracking-tight">
            Bari<span className="text-primary">Basa</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex lg:gap-2">
          {NAV_LINKS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:text-foreground",
                  isActive
                    ? "bg-muted font-semibold text-foreground"
                    : "text-muted-foreground hover:bg-muted/60",
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Auth & Actions */}
        <div className="hidden items-center gap-3 sm:flex">
          {isLoading ? (
            <div className="h-14 w-32 animate-pulse rounded-lg bg-muted" />
          ) : user && role ? (
            <div className="flex items-center gap-3">
              <Link
                href={getDashboardPath(role)}
                className={buttonVariants({ variant: "outline" })}
              >
                <LayoutDashboard />
                Dashboard
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-full p-0.5 outline-none hover:ring-2 hover:ring-ring/40 transition"
                    />
                  }
                >
                  <Avatar size="sm">
                    {user.imageUrl && (
                      <AvatarImage src={user.imageUrl} alt={user.name} />
                    )}
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="size-3 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <div className="pt-1">
                        <Badge
                          variant={getRoleBadgeVariant(role)}
                          size="sm"
                          className="capitalize"
                        >
                          {role.toLowerCase().replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    render={<Link href={getDashboardPath(role)} />}
                  >
                    <LayoutDashboard className="size-4 mr-2" />
                    My Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="size-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost" })}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className={buttonVariants({ variant: "default" })}
              >
                Get Started
              </Link>
              <Link
                href="/login#demo-login"
                className={buttonVariants({
                  variant: "outline",
                  className: "hidden xl:inline-flex",
                })}
                title="Try 1-Click Demo Accounts"
              >
                <Sparkles />
                Demo Logins
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="flex items-center sm:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Open Mobile Menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader className="text-left border-b pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Building2 className="size-4" />
                  </div>
                  <span>BariBasa</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-5 py-6">
                <nav className="flex flex-col space-y-1">
                  {NAV_LINKS.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 font-semibold text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <Icon className="size-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                <div className="border-t pt-4">
                  {user && role ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 px-2">
                        <Avatar size="sm">
                          {user.imageUrl && (
                            <AvatarImage src={user.imageUrl} alt={user.name} />
                          )}
                          <AvatarFallback>
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium truncate">
                            {user.name}
                          </p>
                          <Badge variant={getRoleBadgeVariant(role)} size="sm">
                            {role}
                          </Badge>
                        </div>
                      </div>

                      <Link
                        href={getDashboardPath(role)}
                        onClick={() => setMobileMenuOpen(false)}
                        className={buttonVariants({
                          variant: "default",
                          className: "w-full justify-center",
                        })}
                      >
                        <LayoutDashboard className="size-4 mr-2" />
                        Go to Dashboard
                      </Link>

                      <Button
                        variant="outline"
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-center text-destructive"
                      >
                        <LogOut className="size-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className={buttonVariants({
                          variant: "outline",
                          className: "w-full justify-center",
                        })}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className={buttonVariants({
                          variant: "default",
                          className: "w-full justify-center",
                        })}
                      >
                        Get Started
                      </Link>
                      <Link
                        href="/login#demo-login"
                        onClick={() => setMobileMenuOpen(false)}
                        className={buttonVariants({
                          variant: "secondary",
                          className: "w-full justify-center text-xs",
                        })}
                      >
                        <Sparkles className="size-3.5 mr-1.5" />
                        Quick Demo Login
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
