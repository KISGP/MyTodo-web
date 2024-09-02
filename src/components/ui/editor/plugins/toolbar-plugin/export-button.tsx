import DownloadIcon from "@/assets/svg/download.svg?react";

import { toolbarIconClass, toolbarButtonClass } from "../../theme";

type ToolbarButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function ExportButton({ onClick }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={toolbarButtonClass}
      aria-label="Export"
      title="Export"
    >
      <DownloadIcon className={toolbarIconClass} />
    </button>
  );
}
