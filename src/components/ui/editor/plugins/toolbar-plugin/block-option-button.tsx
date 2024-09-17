import React from "react";
import { $createCodeNode } from "@lexical/code";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { LexicalEditor, $getSelection, $isRangeSelection, $createParagraphNode } from "lexical";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from "@lexical/list";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";

import CodeIcon from "@/assets/svg/code.svg?react";
import H1Icon from "@/assets/svg/type-h1.svg?react";
import H2Icon from "@/assets/svg/type-h2.svg?react";
import H3Icon from "@/assets/svg/type-h3.svg?react";
import H4Icon from "@/assets/svg/type-h4.svg?react";
import H5Icon from "@/assets/svg/type-h5.svg?react";
import H6Icon from "@/assets/svg/type-h6.svg?react";
import ListUlIcon from "@/assets/svg/list-ul.svg?react";
import ListOlIcon from "@/assets/svg/list-ol.svg?react";
import ChevronDownIcon from "@/assets/svg/chevron-down.svg?react";
import ParagraphIcon from "@/assets/svg/text-paragraph.svg?react";
import ChatSquareQuoteIcon from "@/assets/svg/chat-square-quote.svg?react";

const supportedBlockTypes = new Set(["paragraph", "quote", "code", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol"]);

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

type ToolbarButtonProps = {
  blockType: string;
  editor: LexicalEditor;
};

export default function BlockOptionButton({ blockType, editor }: ToolbarButtonProps) {
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
      },
    },
  ];

  if (supportedBlockTypes.has(blockType)) {
    const Icon = blockTypeToIcon[blockType];
    return (
      <Dropdown>
        <DropdownTrigger>
          <Button variant="light">
            <Icon className="size-5 fill-default-500 dark:fill-default-400" />
            <span className="text-default-500 dark:text-default-400">{blockTypeToBlockName[blockType]}</span>
            <ChevronDownIcon className="size-3 fill-default-500 dark:fill-default-400" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="flat">
          {formatOptions.map((option) => {
            const Icon = blockTypeToIcon[option.type];
            return (
              <DropdownItem
                key={option.type}
                onClick={option.onClick}
                title={blockTypeToBlockName[option.type]}
                startContent={<Icon className="mx-1 h-5 w-5" />}
              />
            );
          })}
        </DropdownMenu>
      </Dropdown>
    );
  } else {
    return <></>;
  }
}
