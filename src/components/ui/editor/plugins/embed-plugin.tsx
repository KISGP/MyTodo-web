import { useMemo, useState } from "react";
import type { LexicalEditor } from "lexical";
import { Button, Input } from "@nextui-org/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  AutoEmbedOption,
  EmbedConfig,
  EmbedMatchResult,
  LexicalAutoEmbedPlugin,
  URL_MATCHER,
} from "@lexical/react/LexicalAutoEmbedPlugin";

import useModal from "../hook/useModal.tsx";

import { INSERT_BILIBILI_COMMAND } from "./bilibili-plugin.tsx";

interface PlaygroundEmbedConfig extends EmbedConfig {
  contentName: string;

  // 示例 URL
  exampleUrl: string;
}

export const BilibiliEmbedConfig: PlaygroundEmbedConfig = {
  type: "bilibili-video",

  contentName: "Bilibili Video",

  exampleUrl: "https://www.bilibili.com/video/BV1azHwe6Edh/",

  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_BILIBILI_COMMAND, result.id);
  },

  parseUrl: async (url: string) => {
    const match = /\/BV([a-zA-Z0-9]+)/.exec(url);
    const id = match ? `BV${match[1]}` : null;

    if (id != null) {
      return {
        id,
        url,
      };
    }

    return null;
  },
};

export const EmbedConfigs = [BilibiliEmbedConfig];

const debounce = (callback: (text: string) => void, delay: number) => {
  let timeoutId: number;
  return (text: string) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(text);
    }, delay);
  };
};

export function AutoEmbedDialog({
  embedConfig,
  onClose,
}: {
  embedConfig: PlaygroundEmbedConfig;
  onClose: () => void;
}): JSX.Element {
  const [text, setText] = useState("");
  const [editor] = useLexicalComposerContext();
  const [embedResult, setEmbedResult] = useState<EmbedMatchResult | null>(null);

  const validateText = useMemo(
    () =>
      debounce((inputText: string) => {
        const urlMatch = URL_MATCHER.exec(inputText);
        if (embedConfig != null && inputText != null && urlMatch != null) {
          Promise.resolve(embedConfig.parseUrl(inputText)).then((parseResult) => {
            setEmbedResult(parseResult);
          });
        } else if (embedResult != null) {
          setEmbedResult(null);
        }
      }, 200),
    [embedConfig, embedResult],
  );

  const onClick = () => {
    if (embedResult != null) {
      embedConfig.insertNode(editor, embedResult);
      onClose();
    }
  };

  return (
    <div className="flex flex-col">
      <Input
        value={text}
        type="text"
        color="primary"
        variant="bordered"
        placeholder={`example: ${embedConfig.exampleUrl}`}
        onValueChange={(newValue) => {
          setText(newValue);
          validateText(newValue);
        }}
        classNames={{
          base: "w-[420px]",
          input: "placeholder:text-default-300",
        }}
      />
      <div className="flex flex-row-reverse">
        <Button className="mt-6 w-fit" onPress={() => onClick()}>
          Embed
        </Button>
      </div>
    </div>
  );
}

export default function AutoEmbedPlugin(): JSX.Element {
  const [modal, showModal] = useModal();

  const openEmbedModal = (embedConfig: PlaygroundEmbedConfig) => {
    showModal(`Embed ${embedConfig.contentName}`, (onClose) => (
      <AutoEmbedDialog embedConfig={embedConfig} onClose={onClose} />
    ));
  };

  const getMenuOptions = (activeEmbedConfig: PlaygroundEmbedConfig, embedFn: () => void, dismissFn: () => void) => {
    return [
      new AutoEmbedOption("Dismiss", {
        onSelect: dismissFn,
      }),
      new AutoEmbedOption(`Embed ${activeEmbedConfig.contentName}`, {
        onSelect: embedFn,
      }),
    ];
  };

  return (
    <>
      {modal}
      <LexicalAutoEmbedPlugin<PlaygroundEmbedConfig>
        embedConfigs={EmbedConfigs}
        onOpenEmbedModalForConfig={openEmbedModal}
        getMenuOptions={getMenuOptions}
        menuRenderFn={() => null}
      />
    </>
  );
}
