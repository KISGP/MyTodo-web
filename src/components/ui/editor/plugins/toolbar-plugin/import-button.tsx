import UploadIcon from "@/assets/svg/upload.svg?react";

import { toolbarIconClass, toolbarButtonClass } from "../../theme";

type ToolbarButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function ImportButton({ onClick }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={toolbarButtonClass}
      aria-label="Import"
      title="Import"
    >
      <UploadIcon className={toolbarIconClass} />
    </button>
  );
}
