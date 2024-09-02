import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import {
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from "lexical";
import { useEffect } from "react";

import { $createBilibiliNode, BilibiliNode } from "../nodes/bilibili-node.tsx";

export const INSERT_BILIBILI_COMMAND: LexicalCommand<string> = createCommand(
  "INSERT_BILIBILI_COMMAND",
);

// FIXME: 无法添加多个视频结点
export default function BilibiliPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([BilibiliNode])) {
      throw new Error("BilibiliPlugin: BilibiliNode not registered on editor");
    }

    return editor.registerCommand<string>(
      INSERT_BILIBILI_COMMAND,
      (payload) => {
        const bilibiliNode = $createBilibiliNode(payload);
        $insertNodeToNearestRoot(bilibiliNode);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
