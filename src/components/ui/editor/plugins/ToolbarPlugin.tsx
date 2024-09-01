import { useCallback, useEffect, useRef, useState } from "react";
import { Divider } from "@nextui-org/react";
import { $isListNode, ListNode } from "@lexical/list";
import { $isHeadingNode } from "@lexical/rich-text";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { mergeRegister, $getNearestNodeOfType } from "@lexical/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from "lexical";
import { exportFile, importFile } from "@lexical/file";

import UndoButton from "../ui/undo-button.tsx";
import RedoButton from "../ui/redo-button.tsx";
import BoldButton from "../ui/bold-button.tsx";
import CodeButton from "../ui/code-button.tsx";
import BlockOptionButton from "../ui/block-option-button.tsx";
import LinkButton, { getSelectedNode } from "../ui/link-button.tsx";
import ItalicButton from "../ui/italic-button.tsx";
import UnderlineButton from "../ui/underline-button.tsx";
import LeftAlignIconButton from "../ui/left-button.tsx";
import CenterAlignIconButton from "../ui/center-button.tsx";
import RightAlignIconButton from "../ui/right-button.tsx";
import StrikethroughButton from "../ui/strikethrough-button.tsx";
import ImportButton from "../ui/import-button.tsx";
import ExportButton from "../ui/export-button.tsx";

const LowPriority = 1;

export default function ToolbarPlugin() {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
        }
      }

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsCode(selection.hasFormat("code"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload) => {
        $updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar]);

  return (
    <div
      className="flex items-center justify-between px-3 py-1 align-middle dark:bg-default-100/50"
      ref={toolbarRef}
    >
      <div className="flex items-center">
        <UndoButton
          disabled={canUndo}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
        />
        <RedoButton
          disabled={canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
        />
        <Divider
          orientation="vertical"
          className="mx-2 h-6 w-[1px] bg-default-300 dark:bg-default-200/80"
        />
        <BlockOptionButton
          editor={editor}
          blockType={blockType}
          toolbarRef={toolbarRef}
        />
        <BoldButton
          active={isBold}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          }}
        />
        <ItalicButton
          active={isItalic}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          }}
        />
        <UnderlineButton
          active={isUnderline}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
          }}
        />
        <StrikethroughButton
          active={isStrikethrough}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          }}
        />
        <CodeButton
          active={isCode}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
          }}
        />
        <LinkButton
          active={isLink}
          editor={editor}
          onClick={useCallback(() => {
            if (!isLink) {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
            } else {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
            }
          }, [editor, isLink])}
        />
        <Divider
          orientation="vertical"
          className="mx-2 h-6 w-[1px] bg-default-300 dark:bg-default-200/80"
        />
        <LeftAlignIconButton
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
          }}
        />
        <CenterAlignIconButton
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
          }}
        />
        <RightAlignIconButton
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
          }}
        />
      </div>
      <div className="flex items-center">
        <ImportButton onClick={() => importFile(editor)} />
        <ExportButton
          onClick={() => {
            exportFile(editor, {
              fileName: `Todo-${new Date().toISOString()}`,
              source: "Playground",
            });
          }}
        />
      </div>
    </div>
  );
}
