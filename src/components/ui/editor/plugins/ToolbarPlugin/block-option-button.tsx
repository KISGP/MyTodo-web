import React, { useState, useRef, useEffect } from "react";
import { cn } from "@nextui-org/react";
import { createPortal } from "react-dom";
import { $createCodeNode } from "@lexical/code";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import {
  LexicalEditor,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";

import ChevronDownIcon from "@/assets/svg/chevron-down.svg?react";
import ParagraphIcon from "@/assets/svg/text-paragraph.svg?react";
import H1Icon from "@/assets/svg/type-h1.svg?react";
import H2Icon from "@/assets/svg/type-h2.svg?react";
import H3Icon from "@/assets/svg/type-h3.svg?react";
import H4Icon from "@/assets/svg/type-h4.svg?react";
import H5Icon from "@/assets/svg/type-h5.svg?react";
import H6Icon from "@/assets/svg/type-h6.svg?react";
import ChatSquareQuoteIcon from "@/assets/svg/chat-square-quote.svg?react";
import ListUlIcon from "@/assets/svg/list-ul.svg?react";
import ListOlIcon from "@/assets/svg/list-ol.svg?react";
import CodeIcon from "@/assets/svg/code.svg?react";

const supportedBlockTypes = new Set([
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
]);

const blockTypeToIcon: {
  [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
} = {
  h1: H1Icon,
  h2: H2Icon,
  h3: H3Icon,
  h4: H4Icon,
  h5: H5Icon,
  h6: H6Icon,
  code: CodeIcon,
  ul: ListUlIcon,
  ol: ListOlIcon,
  paragraph: ParagraphIcon,
  quote: ChatSquareQuoteIcon,
};

const blockTypeToBlockName: { [key: string]: string } = {
  quote: "引用",
  h1: "一级标题",
  h2: "二级标题",
  h3: "三级标题",
  h4: "四级标题",
  h5: "五级标题",
  h6: "六级标题",
  ol: "有序列表",
  ul: "无序列表",
  code: "代码块",
  paragraph: "段落",
};

type BlockOptionsDropdownListType = {
  editor: LexicalEditor;
  blockType: string;
  toolbarRef: React.RefObject<HTMLDivElement>;
  BlockOptionButtonRef: React.RefObject<HTMLButtonElement>;
  setShowBlockOptionsDropDown: (show: boolean) => void;
};

function BlockOptionsDropdownList({
  editor,
  blockType,
  toolbarRef,
  BlockOptionButtonRef,
  setShowBlockOptionsDropDown,
}: BlockOptionsDropdownListType) {
  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;
    const blockOptionButton = BlockOptionButtonRef.current;

    if (toolbar !== null && dropDown !== null && blockOptionButton !== null) {
      // const { top, left } = toolbar.getBoundingClientRect();
      const { left, bottom } = blockOptionButton.getBoundingClientRect();
      dropDown.style.top = `${bottom + 10}px`;
      dropDown.style.left = `${left}px`;
    }
  }, [dropDownRef, BlockOptionButtonRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event: any) => {
        const target = event.target;

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false);
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  const formatOptions = [
    {
      type: "paragraph",
      onClick: () => {
        if (blockType !== "paragraph") {
          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createParagraphNode());
            }
          });
        }
        setShowBlockOptionsDropDown(false);
      },
    },
    {
      type: "h1",
      onClick: () => {
        if (blockType !== "h1") {
          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode("h1"));
            }
          });
        }
        setShowBlockOptionsDropDown(false);
      },
    },
    {
      type: "h2",
      onClick: () => {
        if (blockType !== "h2") {
          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode("h2"));
            }
          });
        }
        setShowBlockOptionsDropDown(false);
      },
    },
    {
      type: "h3",
      onClick: () => {
        if (blockType !== "h3") {
          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode("h3"));
            }
          });
        }
        setShowBlockOptionsDropDown(false);
      },
    },
    {
      type: "h4",
      onClick: () => {
        if (blockType !== "h4") {
          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode("h4"));
            }
          });
        }
        setShowBlockOptionsDropDown(false);
      },
    },
    {
      type: "h5",
      onClick: () => {
        if (blockType !== "h5") {
          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode("h5"));
            }
          });
        }
        setShowBlockOptionsDropDown(false);
      },
    },
    {
      type: "h6",
      onClick: () => {
        if (blockType !== "h6") {
          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode("h6"));
            }
          });
        }
        setShowBlockOptionsDropDown(false);
      },
    },
    {
      type: "ul",
      onClick: () => {
        if (blockType !== "ul") {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        } else {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        }
        setShowBlockOptionsDropDown(false);
      },
    },
    {
      type: "ol",
      onClick: () => {
        if (blockType !== "ol") {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        } else {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        }
        setShowBlockOptionsDropDown(false);
      },
    },
    {
      type: "quote",
      onClick: () => {
        if (blockType !== "quote") {
          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createQuoteNode());
            }
          });
        }
        setShowBlockOptionsDropDown(false);
      },
    },
    {
      type: "code",
      onClick: () => {
        if (blockType !== "code") {
          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createCodeNode());
            }
          });
        }
        setShowBlockOptionsDropDown(false);
      },
    },
  ];

  return (
    <div
      ref={dropDownRef}
      className={cn(
        "absolute z-10 block rounded-xl border shadow-md",
        "min-h-10 min-w-24 p-2",
        "bg-content1 dark:border-zinc-800 dark:bg-zinc-900",
      )}
    >
      {formatOptions.map(({ type, onClick }) => {
        const Icon = blockTypeToIcon[type];
        return (
          <button
            key={type}
            onClick={onClick}
            className={cn(
              "flex cursor-pointer items-center align-middle",
              "mb-1 w-full gap-1 rounded-lg p-2 last:mb-0",
              "hover:bg-zinc-200/60 dark:hover:bg-zinc-800/80",
            )}
          >
            <Icon className="mx-1 h-5 w-5" />
            <span
              title={blockTypeToBlockName[type]}
              className="ml-2 mr-10 inline-block max-w-40 overflow-hidden text-ellipsis text-nowrap text-start"
            >
              {blockTypeToBlockName[type]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

type ToolbarButtonProps = {
  blockType: string;
  toolbarRef: React.RefObject<HTMLDivElement>;
  editor: LexicalEditor;
};

export default function BlockOptionButton({
  blockType,
  toolbarRef,
  editor,
}: ToolbarButtonProps) {
  const BlockOptionButtonRef = useRef<HTMLButtonElement>(null);
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] =
    useState(false);

  if (supportedBlockTypes.has(blockType)) {
    const Icon = blockTypeToIcon[blockType];
    return (
      <>
        <button
          ref={BlockOptionButtonRef}
          className={cn(
            "flex cursor-pointer items-center align-middle outline-none",
            "gap-1 rounded-lg border-0 p-2",
            "hover:bg-default-100 active:bg-default-100 disabled:cursor-not-allowed",
          )}
          onClick={() => setShowBlockOptionsDropDown(!showBlockOptionsDropDown)}
          aria-label="Formatting Options"
        >
          <Icon className="mx-1 h-5 w-5"></Icon>
          <span className="inline-block w-fit text-nowrap text-sm">
            {blockTypeToBlockName[blockType]}
          </span>
          <ChevronDownIcon className="mx-2 h-4 w-4" />
        </button>
        {showBlockOptionsDropDown &&
          createPortal(
            <BlockOptionsDropdownList
              editor={editor}
              blockType={blockType}
              toolbarRef={toolbarRef}
              BlockOptionButtonRef={BlockOptionButtonRef}
              setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
            />,
            document.body,
          )}
      </>
    );
  } else {
    return <> </>;
  }
}
