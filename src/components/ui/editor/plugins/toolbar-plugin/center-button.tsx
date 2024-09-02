import CenterAlignIcon from "@/assets/svg/text-center.svg?react";

import { toolbarIconClass, toolbarButtonClass } from "../../theme";

type ToolbarButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function CenterAlignIconButton({ onClick }: ToolbarButtonProps) {
  return (
    <button
      title="Center Align"
      aria-label="Center Align"
      onClick={onClick}
      className={toolbarButtonClass}
    >
      <CenterAlignIcon className={toolbarIconClass} />
    </button>
  );
}
