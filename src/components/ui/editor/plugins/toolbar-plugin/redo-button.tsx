import ClockwiseIcon from "@/assets/svg/arrow-clockwise.svg?react";

import { toolbarIconClass, toolbarButtonClass } from "../../theme";

type ToolbarButtonProps = {
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function RedoButton({ disabled, onClick }: ToolbarButtonProps) {
  return (
    <button
      disabled={!(disabled ?? true)}
      onClick={onClick}
      className={toolbarButtonClass}
      aria-label="Redo"
      title="Redo (ctrl+Y)"
    >
      <ClockwiseIcon className={toolbarIconClass} />
    </button>
  );
}
