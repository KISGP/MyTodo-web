import { cn } from "@nextui-org/react";

import StrikethroughIcon from "@/assets/svg/type-strikethrough.svg?react";

import { toolbarIconClass, toolbarButtonClass, toolbarIconActiveClass, toolbarButtonActiveClass } from "../../theme";

type ToolbarButtonProps = {
  active?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function StrikethroughButton({ active, onClick }: ToolbarButtonProps) {
  return (
    <button
      title="Strikethrough"
      aria-label="Strikethrough"
      onClick={onClick}
      className={cn(toolbarButtonClass, active && toolbarButtonActiveClass)}
    >
      <StrikethroughIcon className={cn(toolbarIconClass, active && toolbarIconActiveClass)} />
    </button>
  );
}
