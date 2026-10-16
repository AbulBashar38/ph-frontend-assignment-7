"use client";

import { ChevronDown, Globe, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, useLogoutAction } from "@/hooks";
import { formatEnum, getDashboardPath, getInitials } from "@/utils";

export default function UserMenu() {
  const { user } = useAuth();
  const { logout, isLoggingOut } = useLogoutAction();

  if (!user) return null;

  const initials = getInitials(user.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          />
        }
      >
        <Avatar>
          {user.imageUrl && <AvatarImage src={user.imageUrl} alt="" />}
          <AvatarFallback className="bg-accent text-xs font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
          {user.name}
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        {/* A label must live inside a group (Base UI throws error #31 otherwise) */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="space-y-1.5 font-normal">
            <p className="truncate text-sm font-medium text-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs">{user.email}</p>
            <span className="inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-primary">
              {formatEnum(user.role)}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            render={<Link href={`${getDashboardPath(user.role)}/profile`} />}
          >
            <UserRound />
            Profile & settings
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/" />}>
            <Globe />
            Back to the website
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isLoggingOut}
          onClick={() => logout()}
        >
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
