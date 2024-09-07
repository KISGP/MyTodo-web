import LeftAlignIcon from "@/assets/svg/text-left.svg?react";

import { toolbarIconClass, toolbarButtonClass } from "../../theme";

type ToolbarButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function LeftAlignIconButton({ onClick }: ToolbarButtonProps) {
  return (
    <button title="Left Align" aria-label="Left Align" onClick={onClick} className={toolbarButtonClass}>
      <LeftAlignIcon className={toolbarIconClass} />
    </button>
  );
}
