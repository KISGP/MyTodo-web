import { LexicalComposer, InitialConfigType } from "@lexical/react/LexicalComposer";
import { cn, Divider } from "@nextui-org/react";
import { CodeNode } from "@lexical/code";
import { TRANSFORMERS } from "@lexical/markdown";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";

import ToolbarPlugin from "./plugins/toolbar-plugin/index.tsx";
import BilibiliPlugin from "./plugins/bilibili-plugin.tsx";
import AutoEmbedPlugin from "./plugins/embed-plugin.tsx";
import ActionPlugin from "./plugins/action-plugin.tsx";
import SavePlugin from "./plugins/save-plugin.tsx";

import { BilibiliNode } from "./nodes/bilibili-node.tsx";

import theme from "./theme.ts";
import "./editor.css";
import { memo } from "react";

function Placeholder() {
  return (
    <div className="pointer-events-none absolute left-3 top-2 select-none text-default-500/60">
      <p>输入待办详情~</p>
    </div>
  );
}

const MATCHERS = [
  (text: any) => {
    const URL_MATCHER =
      /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
    const match = URL_MATCHER.exec(text);
    if (match === null) {
      return null;
    }
    const fullMatch = match[0];
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch.startsWith("http") ? fullMatch : `https://${fullMatch}`,
      attributes: { rel: "noreferrer", target: "_blank" },
    };
  },
];

const LexicalEditor = memo(() => {
  const initialConfig: InitialConfigType = {
    namespace: "LexicalEditor",
    theme,
    onError(error: Error) {
      throw error;
    },
    nodes: [HeadingNode, QuoteNode, CodeNode, ListNode, ListItemNode, LinkNode, AutoLinkNode, BilibiliNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <Divider />
      <ActionPlugin />
      <div className="relative py-2 pl-3">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className={cn(
                "scrollbar relative resize-none overflow-y-auto outline-none",
                "h-[calc(100vh_-_255px)] max-w-full",
                "caret-default-800",
              )}
              aria-placeholder="输入待办详情"
              placeholder={<Placeholder />}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        <LinkPlugin />
        <SavePlugin />
        <HistoryPlugin />
        <BilibiliPlugin />
        <AutoFocusPlugin />
        <AutoEmbedPlugin />
        <ClearEditorPlugin />
        <AutoLinkPlugin matchers={MATCHERS} />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      </div>
    </LexicalComposer>
  );
});

export default LexicalEditor;
