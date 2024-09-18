import { memo } from "react";
import { cn } from "@nextui-org/react";

import type { TagType } from "@/store";

const Tag = memo(({ tag, icon }: { tag: TagType; icon?: string }) => {
  return (
    <div className="flex min-w-fit select-none items-center gap-1 rounded-full border border-default-200 bg-default-100/50 px-2 py-1 transition-colors dark:border-default-100">
      <div className={cn(tag.icon, icon)} />
      <span className="text-xs text-default-500 dark:text-default-500/80">{tag.title}</span>
    </div>
  );
});

export default Tag;
