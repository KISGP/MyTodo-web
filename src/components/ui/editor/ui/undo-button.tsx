import { cn } from "@nextui-org/react";

import CounterclockwiseIcon from "@/assets/svg/arrow-counterclockwise.svg?react";

type ToolbarButtonProps = {
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function UndoButton({ disabled, onClick }: ToolbarButtonProps) {
  return (
    <button
      disabled={!(disabled ?? true)}
      onClick={onClick}
      className={cn(
        "group flex cursor-pointer align-middle",
        "mr-[2px] gap-1 rounded-lg border-0 p-2",
        "hover:bg-default-100 active:bg-default-100 disabled:cursor-not-allowed",
      )}
      aria-label="Undo"
      title="Undo (ctrl+z)"
    >
      <CounterclockwiseIcon
        className={cn(
          "inline-block bg-contain",
          "mt-[2px] size-[18px] align-[-0.25em] opacity-60",
          "group-active:opacity-100 group-disabled:opacity-20",
        )}
      />
    </button>
  );
}
