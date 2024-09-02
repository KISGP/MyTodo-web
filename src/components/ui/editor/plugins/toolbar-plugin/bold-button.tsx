import { cn } from "@nextui-org/react";

import BoldIcon from "@/assets/svg/type-bold.svg?react";

import {
  toolbarIconClass,
  toolbarButtonClass,
  toolbarIconActiveClass,
  toolbarButtonActiveClass,
} from "../../theme";

type ToolbarButtonProps = {
  active?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function BoldButton({ active, onClick }: ToolbarButtonProps) {
  return (
    <button
      title="Bold"
      aria-label="Bold"
      onClick={onClick}
      className={cn(toolbarButtonClass, active && toolbarButtonActiveClass)}
    >
      <BoldIcon
        className={cn(toolbarIconClass, active && toolbarIconActiveClass)}
      />
    </button>
  );
}
