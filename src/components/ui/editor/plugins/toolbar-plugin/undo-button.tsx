import CounterclockwiseIcon from "@/assets/svg/arrow-counterclockwise.svg?react";

import { toolbarIconClass, toolbarButtonClass } from "../../theme";

type ToolbarButtonProps = {
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function UndoButton({ disabled, onClick }: ToolbarButtonProps) {
  return (
    <button
      disabled={!(disabled ?? true)}
      onClick={onClick}
      className={toolbarButtonClass}
      aria-label="Undo"
      title="Undo (ctrl+z)"
    >
      <CounterclockwiseIcon className={toolbarIconClass} />
    </button>
  );
}
