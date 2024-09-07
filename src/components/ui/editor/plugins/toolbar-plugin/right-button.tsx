import RightAlignIcon from "@/assets/svg/text-right.svg?react";

import { toolbarIconClass, toolbarButtonClass } from "../../theme";

type ToolbarButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function RightAlignIconButton({ onClick }: ToolbarButtonProps) {
  return (
    <button onClick={onClick} className={toolbarButtonClass} aria-label="Right Align" title="Right Align">
      <RightAlignIcon className={toolbarIconClass} />
    </button>
  );
}
