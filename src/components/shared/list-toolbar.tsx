import type { ReactNode } from "react";

// Status tabs on one side, filter and sort selects on the other; stacks until there's room for both
export default function ListToolbar({
  tabs,
  children,
}: {
  tabs: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
      <div className="min-w-0">{tabs}</div>
      {children && (
        <div className="grid gap-3 sm:flex sm:flex-wrap 2xl:flex-nowrap">
          {children}
        </div>
      )}
    </div>
  );
}
