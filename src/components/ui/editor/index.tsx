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

import { useStore } from "@/store/index.ts";

import theme from "./theme.ts";
import "./editor.css";

function Placeholder() {
  return (
    <div className="pointer-events-none absolute left-3 top-2 select-none text-base text-default-500/60">
      {[
        "输入待办详情~",
        "——————————————————————————————————————",
        "功能：",
        "支持 Markdown 语法（标题，无序/有序列表，引用块）",
        "支持水平对齐方式",
        "支持文本加粗，斜体，下划线，删除线",
        "支持撤销/重做（ctrl+Z / ctrl+Y）",
        "支持代码块",
        "支持链接（选中文字后点击工具栏链接按钮，输入链接地址，按下 Enter 键保存输入）",
        "支持链接自动识别",
        "支持插入 Bilibili 视频",
      ].map((item, index) => {
        return (
          <p key={index} className="mb-2">
            {item}
          </p>
        );
      })}
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

export default function LexicalEditor() {
  const editorId = useStore((state) => state.editorId);

  const initialConfig: InitialConfigType = {
    namespace: "LexicalEditor",
    theme,
    onError(error: Error) {
      throw error;
    },
    nodes: [HeadingNode, QuoteNode, CodeNode, ListNode, ListItemNode, LinkNode, AutoLinkNode, BilibiliNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig} key={editorId}>
      <div className="relative w-full rounded-xl bg-content2 text-left text-base font-normal dark:text-default-500/80">
        <ToolbarPlugin />
        <Divider />
        <ActionPlugin />
        <div className="relative py-2 pl-3">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={cn(
                  "relative resize-none overflow-scroll outline-none",
                  "h-[calc(100vh_-_213px)] max-h-[calc(100vh_-_213px)] max-w-full",
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
      </div>
    </LexicalComposer>
  );
}
