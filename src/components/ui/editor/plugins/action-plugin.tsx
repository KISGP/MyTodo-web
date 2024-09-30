import { exportFile, importFile } from "@lexical/file";
import UploadIcon from "@/assets/svg/upload.svg?react";
import DownloadIcon from "@/assets/svg/download.svg?react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { toolbarIconClass, toolbarButtonClass } from "../theme";

export default function ActionPlugin() {
  const [editor] = useLexicalComposerContext();
  return (
    <div className="absolute bottom-1 right-1 z-50 flex gap-1">
      <button onClick={() => importFile(editor)} className={toolbarButtonClass} aria-label="Import" title="Import">
        <UploadIcon className={toolbarIconClass} />
      </button>
      <button
        onClick={() => {
          exportFile(editor, {
            fileName: `Todo-${new Date().toISOString()}`,
            source: "Playground",
          });
        }}
        className={toolbarButtonClass}
        aria-label="Export"
        title="Export"
      >
        <DownloadIcon className={toolbarIconClass} />
      </button>
    </div>
  );
}
