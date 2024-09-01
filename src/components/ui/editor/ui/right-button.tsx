import { cn } from "@nextui-org/react";

import RightAlignIcon from "@/assets/svg/text-right.svg?react";

type ToolbarButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function RightAlignIconButton({ onClick }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex cursor-pointer align-middle outline-none",
        "mr-[2px] gap-1 rounded-lg border-0 p-2",
        "hover:bg-default-100 active:bg-default-100 disabled:cursor-not-allowed",
      )}
      aria-label="Right Align"
      title="Right Align"
    >
      <RightAlignIcon
        className={cn(
          "inline-block bg-contain",
          "mt-[2px] size-[18px] align-[-0.25em] opacity-60",
          "group-active:opacity-100 group-disabled:opacity-20",
        )}
      />
    </button>
  );
}
