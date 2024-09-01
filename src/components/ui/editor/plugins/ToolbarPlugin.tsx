import { useCallback, useEffect, useRef, useState } from "react";

import { mergeRegister } from "@lexical/utils";
import { Divider } from "@nextui-org/react";
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
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import UndoButton from "../ui/undo-button.tsx";
import RedoButton from "../ui/redo-button.tsx";
import BoldButton from "../ui/bold-button.tsx";
import LinkButton, { getSelectedNode } from "../ui/link-button.tsx";
import ItalicButton from "../ui/italic-button.tsx";
import UnderlineButton from "../ui/underline-button.tsx";
import LeftAlignIconButton from "../ui/left-button.tsx";
import CenterAlignIconButton from "../ui/center-button.tsx";
import RightAlignIconButton from "../ui/right-button.tsx";
import StrikethroughButton from "../ui/strikethrough-button.tsx";

const LowPriority = 1;

export default function ToolbarPlugin() {
  const toolbarRef = useRef(null);
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
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
      className="flex items-center rounded-r-xl px-3 py-1 align-middle dark:bg-default-100/50"
      ref={toolbarRef}
    >
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
        className="mx-4 h-6 w-[1px] bg-default-300"
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
        className="mx-4 h-6 w-[1px] bg-default-300"
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
  );
}
