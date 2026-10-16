import { Mail, Phone } from "lucide-react";
import type { RoommateContact } from "@/types";

// Email and phone of an accepted connection, as tap-to-contact links
export default function ContactLinks({ person }: { person: RoommateContact }) {
  if (!person.email && !person.phone) return null;

  return (
    <ul className="flex flex-col gap-1.5 text-sm sm:flex-row sm:flex-wrap sm:gap-x-5">
      {person.email && (
        <li>
          <a
            href={`mailto:${person.email}`}
            className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
          >
            <Mail className="size-4" />
            {person.email}
          </a>
        </li>
      )}
      {person.phone && (
        <li>
          <a
            href={`tel:${person.phone}`}
            className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
          >
            <Phone className="size-4" />
            {person.phone}
          </a>
        </li>
      )}
    </ul>
  );
}
