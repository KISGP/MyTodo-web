import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { mergeRegister } from "@lexical/utils";
import { cn } from "@nextui-org/react";
import { $isAtNodeEnd } from "@lexical/selection";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";

import LinkIcon from "@/assets/svg/link.svg?react";
import EditIcon from "@/assets/svg/edit.svg?react";

const LowPriority = 1;

export function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function positionEditorElement(editor: any, rect: DOMRect | null) {
  if (rect === null) {
    editor.style.opacity = "0";
    editor.style.top = "-1000px";
    editor.style.left = "-1000px";
  } else {
    editor.style.opacity = "1";
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
}

function FloatingLinkEditor({ editor }: { editor: LexicalEditor }) {
  const editorRef = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect: DOMRect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild as HTMLElement;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }
      setLastSelection(selection as any);
    } else if (
      !activeElement ||
      !activeElement.className.includes("link-input")
    ) {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl("");
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority,
      ),
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  const inputClass = cn(
    "link-input",
    "relative box-border flex items-center justify-between outline-none",
    "m-2 w-[304px] rounded-lg border-none px-3 py-2 underline-offset-4",
    "bg-zinc-300/40 dark:bg-zinc-800/50",
  );

  return (
    <div
      ref={editorRef}
      className={cn(
        "absolute left-[-10000px] top-[-10000px] z-10 transition-opacity",
        "mt-2 w-80 min-w-80 max-w-80 rounded-xl border opacity-0 shadow-md",
        "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900",
      )}
    >
      {isEditMode ? (
        <input
          ref={inputRef}
          className={inputClass}
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== "") {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }
                setEditMode(false);
              }
            } else if (event.key === "Escape") {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      ) : (
        <div className={inputClass}>
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-64 inline-block overflow-hidden overflow-ellipsis whitespace-nowrap text-primary-500 hover:underline"
          >
            {linkUrl}
          </a>
          <EditIcon
            tabIndex={0}
            className="h-5 w-5 cursor-pointer fill-default-700/60 hover:fill-primary-600"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setEditMode(true);
            }}
          />
        </div>
      )}
    </div>
  );
}

type ToolbarButtonProps = {
  active: boolean;
  editor: LexicalEditor;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function LinkButton({
  active,
  editor,
  onClick,
}: ToolbarButtonProps) {
  return (
    <>
      <button
        onClick={onClick}
        className={cn(
          "group flex cursor-pointer align-middle outline-none",
          "mr-[2px] gap-1 rounded-lg border-0 p-2",
          "hover:bg-default-100 active:bg-default-100 disabled:cursor-not-allowed",
          active && "!bg-primary-100/60 dark:!bg-primary-500/30",
        )}
        aria-label="Link"
        title="Link"
      >
        <LinkIcon
          className={cn(
            "inline-block bg-contain",
            "mt-[2px] size-[18px] align-[-0.25em] opacity-60",
            "group-active:opacity-100 group-disabled:opacity-20",
            active && "!opacity-100",
          )}
        />
      </button>
      {active &&
        createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
    </>
  );
}
