// import { useEffect } from "react";
// import { $getRoot, $getSelection } from "lexical";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import theme from "./theme.ts";
import ToolbarPlugin from "./plugins/ToolbarPlugin.tsx";

import "@/styles/editor/index.css";

const editorConfig = {
  namespace: "Editor",
  nodes: [],
  theme,
  onError(error: Error) {
    throw error;
  },
};

export default function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="relative w-full text-left text-base font-normal dark:text-default-900/80">
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="relative h-[calc(100vh_-_168px)] max-h-[calc(100vh_-_168px)] resize-none overflow-scroll px-3 py-4 caret-default-800 outline-none"
                aria-placeholder="输入待办详情"
                placeholder={
                  <div className="pointer-events-none absolute left-3 top-4 select-none text-base text-default-500/60">
                    输入待办详情~
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
