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
        "----------------------------------------",
        "需求（优先级高）：",
        "添加路由鉴权",
        "修改用户头像显示当前用户账号",
        "设计后端接口使用文件",
        "完善登录注册逻辑",
        "添加设置页面（和用户页面一起）",
        "----------------------------------------",
        "需求（优先级低）：",
        "添加信息页面（介绍使用的技术及框架和库之类的）",
        "编辑器插入图片",
        "添加看板样例",
        "添加日历样例",
        "编辑器添加tab缩进",
      ].map((item, index) => {
        return (
          <p key={index} className="mb-2 text-sm">
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
                  "relative resize-none overflow-y-scroll outline-none scrollbar",
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
