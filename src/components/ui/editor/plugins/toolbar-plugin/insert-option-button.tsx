import { LexicalEditor } from "lexical";
import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";

import DropDown, { DropDownItem } from "../../ui/drop-down";

import PluseIcon from "@/assets/svg/plus.svg?react";
import BilibiliIcon from "@/assets/svg/bilibili.svg?react";

type ToolbarButtonProps = {
  editor: LexicalEditor;
};

export default function InsertOptionButton({ editor }: ToolbarButtonProps) {
  return (
    <DropDown title="Insert" Icon={PluseIcon}>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(INSERT_EMBED_COMMAND, "bilibili-video");
        }}
      >
        <BilibiliIcon className="mx-1 h-5 w-5 fill-default-400 group-hover:fill-primary-400" />
        <span className="ml-2 mr-10 inline-block max-w-40 overflow-hidden text-ellipsis text-nowrap text-start">
          Bilibili Video
        </span>
      </DropDownItem>
    </DropDown>
  );
}
