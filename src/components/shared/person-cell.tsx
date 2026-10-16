import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils";

// Avatar, name and a detail line (phone, email…) for a person in a table row
export default function PersonCell({
  name,
  imageUrl,
  detail,
}: {
  name: string;
  imageUrl?: string | null;
  detail?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar size="lg">
        {imageUrl && <AvatarImage src={imageUrl} alt="" />}
        <AvatarFallback className="bg-accent text-xs font-semibold text-primary">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-medium">{name}</p>
        {detail && (
          <p className="truncate text-sm text-muted-foreground">{detail}</p>
        )}
      </div>
    </div>
  );
}
