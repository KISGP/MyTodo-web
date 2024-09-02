import { cn } from "@nextui-org/react";

import ItalicIcon from "@/assets/svg/type-italic.svg?react";

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

export default function ItalicButton({ active, onClick }: ToolbarButtonProps) {
  return (
    <button
      title="Italic"
      aria-label="Italic"
      onClick={onClick}
      className={cn(toolbarButtonClass, active && toolbarButtonActiveClass)}
    >
      <ItalicIcon
        className={cn(toolbarIconClass, active && toolbarIconActiveClass)}
      />
    </button>
  );
}
