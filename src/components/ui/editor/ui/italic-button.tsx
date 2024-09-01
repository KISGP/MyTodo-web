import { cn } from "@nextui-org/react";

import ItalicIcon from "@/assets/svg/type-italic.svg?react";

type ToolbarButtonProps = {
  active?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function ItalicButton({ active, onClick }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex cursor-pointer align-middle",
        "mr-[2px] gap-1 rounded-lg border-0 p-2",
        "hover:bg-default-100 active:bg-default-100 disabled:cursor-not-allowed",
        active && "!bg-primary-100/60 dark:!bg-primary-500/30",
      )}
      aria-label="Italic"
      title="Italic"
    >
      <ItalicIcon
        className={cn(
          "inline-block bg-contain",
          "mt-[2px] size-[18px] align-[-0.25em] opacity-60",
          "group-active:opacity-100 group-disabled:opacity-20",
          active && "!opacity-100",
        )}
      />
    </button>
  );
}