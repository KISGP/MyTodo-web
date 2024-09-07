import { cn } from "@nextui-org/react";

import UnderlineIcon from "@/assets/svg/type-underline.svg?react";

import { toolbarIconClass, toolbarButtonClass, toolbarIconActiveClass, toolbarButtonActiveClass } from "../../theme";

type ToolbarButtonProps = {
  active?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function UnderlineButton({ active, onClick }: ToolbarButtonProps) {
  return (
    <button
      title="Underline"
      aria-label="Underline"
      onClick={onClick}
      className={cn(toolbarButtonClass, active && toolbarButtonActiveClass)}
    >
      <UnderlineIcon className={cn(toolbarIconClass, active && toolbarIconActiveClass)} />
    </button>
  );
}
