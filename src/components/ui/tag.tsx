import { memo } from "react";
import { cn } from "@nextui-org/react";
import { TagType } from "@/store";

export const TagIcon = memo<{ color?: string; className?: string }>(({ color, className }) => {
  return (
    <div
      className={cn(
        "size-4 flex-shrink-0 flex-grow-0 rounded-full border-2 border-solid transition-colors",
        color,
        className,
      )}
    />
  );
});

const Tag = memo<{
  tag: Partial<Pick<TagType, "title" | "color">>;
  classNames?: { base?: string; icon?: string; text?: string };
}>(({ tag, classNames }) => {
  return (
    <div
      className={cn(
        "flex w-fit min-w-fit select-none items-center gap-2 rounded-full border border-default-200 bg-default-100/50 px-2 py-1 transition-colors dark:border-default-100",
        classNames?.base,
      )}
    >
      <TagIcon color={tag.color} className={classNames?.icon} />
      <span className={cn("text-xs text-default-500 dark:text-default-500/80", classNames?.text)}>{tag.title}</span>
    </div>
  );
});

export default Tag;
