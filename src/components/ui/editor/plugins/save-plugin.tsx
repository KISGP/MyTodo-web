import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { throttle } from "@/lib/utils";
import { useStore } from "@/store";

export default function SavePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const saveTodo_content = useStore((state) => state.saveTodo_content);

  const [content, isEditorContentChanged, toggleEditorContentChanged] = useStore((state) => [
    state.todo.content,
    state.isAllowContentChanged,
    state.toggleIsAllowContentChanged,
  ]);

  useEffect(() => {
    if (isEditorContentChanged && content) {
      toggleEditorContentChanged(false);
      editor.setEditorState(editor.parseEditorState(content));
    }
  }, [content, isEditorContentChanged]);

  useEffect(() => {
    const autoSave = throttle(() => {
      saveTodo_content(JSON.stringify(editor.getEditorState().toJSON()));
      // TODO: 添加用户自定义多少秒保存一次
    }, 1000);

    editor.registerUpdateListener(autoSave);
  }, []);

  return null;
}
