import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { throttle } from "@/lib/utils";
import { useStore } from "@/store";

export default function SavePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  // 把 editor 暴露到window对象里面，以便 store 里面可以修改 editor 的内容
  window.editor = editor;

  const update_tempTodo = useStore((state) => state.update_tempTodo);

  useEffect(() => {
    const autoSave = throttle(() => {
      update_tempTodo({ content: JSON.stringify(editor.getEditorState().toJSON()) });
      // TODO: 添加用户自定义多少秒保存一次
      // FIXME: 找到一个合适的时间间隔
    }, 200);

    editor.registerUpdateListener(autoSave);
  }, []);

  return null;
}
