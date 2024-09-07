import SaveIcon from "@/assets/svg/save.svg?react";

import { toolbarIconClass, toolbarButtonClass } from "../../theme";

type ToolbarButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function BoldButton({ onClick }: ToolbarButtonProps) {
  return (
    <button title="Save" aria-label="Save" onClick={onClick} className={toolbarButtonClass}>
      <SaveIcon className={toolbarIconClass} />
    </button>
  );
}
