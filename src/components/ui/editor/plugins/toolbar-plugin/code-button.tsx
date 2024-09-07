import { cn } from "@nextui-org/react";

import CodeIcon from "@/assets/svg/code.svg?react";

import { toolbarIconClass, toolbarButtonClass, toolbarIconActiveClass, toolbarButtonActiveClass } from "../../theme";

type ToolbarButtonProps = {
  active?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function CodeButton({ active, onClick }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(toolbarButtonClass, active && toolbarButtonActiveClass)}
      aria-label="Code"
      title="Code"
    >
      <CodeIcon className={cn(toolbarIconClass, active && toolbarIconActiveClass)} />
    </button>
  );
}
