import { LexicalEditor } from "lexical";
import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

import PluseIcon from "@/assets/svg/plus.svg?react";
import BilibiliIcon from "@/assets/svg/bilibili.svg?react";

type ToolbarButtonProps = {
  editor: LexicalEditor;
};

export default function InsertOptionButton({ editor }: ToolbarButtonProps) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light" isIconOnly>
          <PluseIcon className="size-5 fill-default-500 dark:fill-default-400" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="flat">
        <DropdownItem
          key="new"
          title="Bilibili Video"
          startContent={<BilibiliIcon className="mx-1 h-5 w-5 fill-default-400 group-hover:fill-primary-400" />}
          onClick={() => {
            editor.dispatchCommand(INSERT_EMBED_COMMAND, "bilibili-video");
          }}
        />
      </DropdownMenu>
    </Dropdown>
  );
}
