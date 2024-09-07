import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread,
} from "lexical";

import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { DecoratorBlockNode, SerializedDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";

type BilibiliComponentProps = Readonly<{
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  format: ElementFormatType | null;
  nodeKey: NodeKey;
  videoID: string;
}>;

function BilibiliComponent({ className, format, nodeKey, videoID }: BilibiliComponentProps) {
  return (
    <BlockWithAlignableContents className={className} format={format} nodeKey={nodeKey}>
      <div className="mx-4 my-8 h-[180px] max-h-[450px] min-h-[90px] w-[320px] min-w-[160px] max-w-[800px] resize overflow-scroll">
        <iframe
          width="100%"
          height="100%"
          className="mx-auto"
          allowFullScreen={true}
          title="Bilibili video"
          src={`https://player.bilibili.com/player.html?bvid=${videoID}&poster=true&autoplay=false`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </BlockWithAlignableContents>
  );
}

export type SerializedBilibiliNode = Spread<{ videoID: string }, SerializedDecoratorBlockNode>;

function $convertBilibiliElement(domNode: HTMLElement): null | DOMConversionOutput {
  const videoID = domNode.getAttribute("data-lexical-Bilibili");
  if (videoID) {
    const node = $createBilibiliNode(videoID);
    return { node };
  }
  return null;
}

export class BilibiliNode extends DecoratorBlockNode {
  __id: string;

  static getType(): string {
    return "Bilibili";
  }

  static clone(node: BilibiliNode): BilibiliNode {
    return new BilibiliNode(node.__id, node.__format, node.__key);
  }

  static importJSON(serializedNode: SerializedBilibiliNode): BilibiliNode {
    const node = $createBilibiliNode(serializedNode.videoID);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedBilibiliNode {
    return {
      ...super.exportJSON(),
      type: "Bilibili",
      version: 1,
      videoID: this.__id,
    };
  }

  constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__id = id;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("iframe");
    element.setAttribute("data-lexical-Bilibili", this.__id);
    element.setAttribute("width", "560");
    element.setAttribute("height", "315");
    element.setAttribute("src", `https://www.Bilibili-nocookie.com/embed/${this.__id}`);
    element.setAttribute("frameborder", "0");
    element.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
    );
    element.setAttribute("allowfullscreen", "true");
    element.setAttribute("title", "Bilibili video");
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-lexical-Bilibili")) {
          return null;
        }
        return {
          conversion: $convertBilibiliElement,
          priority: 1,
        };
      },
    };
  }

  updateDOM(): false {
    return false;
  }

  getId(): string {
    return this.__id;
  }

  getTextContent(_includeInert?: boolean | undefined, _includeDirectionless?: false | undefined): string {
    return `https://www.Bilibili.com/watch?v=${this.__id}`;
  }

  decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || "",
      focus: embedBlockTheme.focus || "",
    };
    return (
      <BilibiliComponent className={className} format={this.__format} nodeKey={this.getKey()} videoID={this.__id} />
    );
  }
}

export function $createBilibiliNode(videoID: string): BilibiliNode {
  return new BilibiliNode(videoID);
}

export function $isBilibiliNode(node: BilibiliNode | LexicalNode | null | undefined): node is BilibiliNode {
  return node instanceof BilibiliNode;
}
