import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
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
} from "lexical";
import { cn, Divider } from "@nextui-org/react";

import CounterclockwiseIcon from "@/assets/svg/arrow-counterclockwise.svg?react";
import ClockwiseIcon from "@/assets/svg/arrow-clockwise.svg?react";
import BoldIcon from "@/assets/svg/type-bold.svg?react";
import ItalicIcon from "@/assets/svg/type-italic.svg?react";
import UnderlineIcon from "@/assets/svg/type-underline.svg?react";
import StrikethroughIcon from "@/assets/svg/type-strikethrough.svg?react";
import LeftAlignIcon from "@/assets/svg/text-left.svg?react";
import CenterAlignIcon from "@/assets/svg/text-center.svg?react";
import RightAlignIcon from "@/assets/svg/text-right.svg?react";

const LowPriority = 1;

type ToolbarButtonProps = {
  // 图标
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  // 标题
  title?: string;
  // 是否可用
  disabled?: boolean;
  // 是否激活
  active?: boolean;
  // 点击事件
  onClick: () => any;
};

type ToolbarItemProps = ToolbarButtonProps | { divider: boolean };

const ToolbarItem: React.FC<ToolbarItemProps> = memo((props) => {
  if ("divider" in props) {
    return (
      <Divider
        orientation="vertical"
        className="mx-4 h-6 w-[1px] bg-default-300"
      />
    );
  } else {
    const { Icon, title, disabled, active, onClick } = props;
    return (
      <button
        disabled={!(disabled ?? true)}
        onClick={onClick}
        className={cn(
          "group flex cursor-pointer align-middle",
          "mr-[2px] gap-1 rounded-lg border-0 p-2",
          "hover:bg-default-100 active:bg-default-100 disabled:cursor-not-allowed",
          active && "!bg-primary-100/60",
        )}
        aria-label={title}
      >
        <Icon
          className={cn(
            "inline-block bg-contain",
            "mt-[2px] size-[18px] align-[-0.25em] opacity-60",
            "group-active:opacity-100 group-disabled:opacity-20",
            active && "!opacity-100",
          )}
        />
      </button>
    );
  }
});

export default function ToolbarPlugin() {
  const toolbarRef = useRef(null);
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

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

  const list: ToolbarItemProps[] = [
    {
      title: "Undo",
      Icon: CounterclockwiseIcon,
      disabled: canUndo,
      onClick: () => {
        editor.dispatchCommand(UNDO_COMMAND, undefined);
      },
    },
    {
      title: "Redo",
      Icon: ClockwiseIcon,
      disabled: canRedo,
      onClick: () => {
        editor.dispatchCommand(REDO_COMMAND, undefined);
      },
    },
    {
      divider: true,
    },
    {
      title: "Bold",
      Icon: BoldIcon,
      active: isBold,
      onClick: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
      },
    },
    {
      title: "Italic",
      Icon: ItalicIcon,
      active: isItalic,
      onClick: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
      },
    },
    {
      title: "Underline",
      Icon: UnderlineIcon,
      active: isUnderline,
      onClick: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
      },
    },
    {
      title: "Strikethrough",
      Icon: StrikethroughIcon,
      active: isStrikethrough,
      onClick: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
      },
    },
    {
      divider: true,
    },
    {
      title: "Left Align",
      Icon: LeftAlignIcon,
      onClick: () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
      },
    },
    {
      title: "Center Align",
      Icon: CenterAlignIcon,
      onClick: () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
      },
    },
    {
      title: "Right Align",
      Icon: RightAlignIcon,
      onClick: () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
      },
    },
  ];

  return (
    <div
      className="flex items-center rounded-r-xl px-3 py-1 align-middle dark:bg-default-100/50"
      ref={toolbarRef}
    >
      {list.map((item, index) => (
        <ToolbarItem key={index} {...item} />
      ))}
    </div>
  );
}
